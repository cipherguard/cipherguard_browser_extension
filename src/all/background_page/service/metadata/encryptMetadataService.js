/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.10.0
 */
import PassphraseStorageService from '../session_storage/passphraseStorageService';
import UserPassphraseRequiredError from "cipherguard-styleguide/src/shared/error/userPassphraseRequiredError";
import GetOrFindMetadataKeysService from "./getOrFindMetadataKeysService";
import EncryptMessageService from "../crypto/encryptMessageService";
import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";
import ResourceEntity from "../../model/entity/resource/resourceEntity";
import DecryptPrivateKeyService from "../crypto/decryptPrivateKeyService";
import {assertAnyTypeOf} from "../../utils/assertions";
import FolderEntity from "../../model/entity/folder/folderEntity";
import GetOrFindMetadataSettingsService from "./getOrFindMetadataSettingsService";
import FoldersCollection from '../../model/entity/folder/foldersCollection';
import ResourcesCollection from '../../model/entity/resource/resourcesCollection';
import ResourceTypeModel from "../../model/resourceType/resourceTypeModel";
import {
  RESOURCE_TYPE_VERSION_5
} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity";

class EncryptMetadataService {
  /**
   * @constructor
   * @param {ApiClientOptions} apiClientOptions
   * @param {AccountEntity} account the account associated to the worker
   */
  constructor(apiClientOptions, account) {
    this.getOrFindMetadataSettingsService = new GetOrFindMetadataSettingsService(account, apiClientOptions);
    this.getOrFindMetadataKeysService = new GetOrFindMetadataKeysService(account, apiClientOptions);
    this.resourceTypesModel = new ResourceTypeModel(apiClientOptions);
    this.account = account;
  }

  /**
   * Encrypts an entity.
   *
   * @param {ResourceEntity|FolderEntity} entity the entity to encrypt.
   * @param {string} [passphrase = null] The passphrase to use to decrypt the metadata private key.
   * @returns {Promise<void>}
   * @throws {UserPassphraseRequiredError} if the `passphrase` is not set and cannot be retrieved.
   * @throws {Error} if metadata key cannot be retrieved.
   * @throws {Error} if metadata is already encrypted.
   */
  async encryptOneForForeignModel(entity, passphrase = null) {
    assertAnyTypeOf(entity, [ResourceEntity, FolderEntity], "The given data type is not a ResourceEntity or a FolderEntity");

    // Do nothing is metadata is already encrypted
    if (!entity.isMetadataDecrypted()) {
      throw new Error("Unable to encrypt the entity metadata, metadata is already encrypted.");
    }

    passphrase = passphrase || await this.getPassphraseFromLocalStorageOrFail();
    const userPrivateKey = await DecryptPrivateKeyService.decryptArmoredKey(this.account.userPrivateArmoredKey, passphrase);
    const serializedMetadata = JSON.stringify(entity.metadata.toDto());

    let encryptedMetadata;
    if (entity.isPersonal() && await this.allowUsageOfPersonalKeys()) {
      const userPublicKey = await OpenpgpAssertion.readKeyOrFail(this.account.userPublicArmoredKey);
      encryptedMetadata = await EncryptMessageService.encrypt(serializedMetadata, userPublicKey, [userPrivateKey]);
      entity._props.metadata_key_id = null;
      entity.metadataKeyType = ResourceEntity.METADATA_KEY_TYPE_USER_KEY;
    } else {
      const {metadataKeyId, metadataPublicKey, metadataPrivateKey} = await this.getLatestMetadataKeysAndId();
      encryptedMetadata = await EncryptMessageService.encrypt(serializedMetadata, metadataPublicKey, [userPrivateKey, metadataPrivateKey]);
      entity.metadataKeyId = metadataKeyId;
      entity.metadataKeyType = ResourceEntity.METADATA_KEY_TYPE_METADATA_KEY;
    }
    entity.metadata = encryptedMetadata;
  }

  /**
   * Encrypts a collection.
   *
   * @param {ResourcesCollection|FoldersCollection} collection the collection to encrypt.
   * @param {string} [passphrase = null] The passphrase to use to decrypt the user private key.
   * @returns {Promise<void>}
   * @throws {UserPassphraseRequiredError} if the `passphrase` is not set and cannot be retrieved.
   * @throws {Error} if metadata key cannot be retrieved.
   * @throws {Error} if metadata is already encrypted.
   */
  async encryptAllFromForeignModels(collection, passphrase = null) {
    assertAnyTypeOf(collection, [ResourcesCollection, FoldersCollection], "The given data type is not a ResourcesCollection or a FoldersCollection");

    // Fail if collection has already some encrypted metadata.
    if (collection.items.some(resourceEntity => !resourceEntity.isMetadataDecrypted())) {
      throw new Error("Unable to encrypt the collection metadata, a resource metadata is already encrypted.");
    }

    const resourceTypesV5Collection = await this.resourceTypesModel.getOrFindAll();
    resourceTypesV5Collection.filterByResourceTypeVersion(RESOURCE_TYPE_VERSION_5);
    // No need to encrypt metadata of resource type v4.
    if (!collection.items.some(resource => Boolean(resourceTypesV5Collection.getFirstById(resource.resourceTypeId)))) {
      return;
    }

    const canUsePersonalKeys = await this.allowUsageOfPersonalKeys();
    passphrase = passphrase || await this.getPassphraseFromLocalStorageOrFail();

    const userDecryptedPrivateKey = await DecryptPrivateKeyService.decryptArmoredKey(this.account.userPrivateArmoredKey, passphrase);

    if (canUsePersonalKeys) {
      await this.encryptAllFromForeignModelsWithUserKey(collection, resourceTypesV5Collection, userDecryptedPrivateKey);
    }
    await this.encryptAllFromForeignModelsWithSharedKey(collection, resourceTypesV5Collection, userDecryptedPrivateKey);
  }

  /**
   * Encrypt the metadata of all entities in the collection with the shared metadata key, and
   * mutates the entities with the encrypted metadata.
   *
   * @param {ResourcesCollection|FoldersCollection} collection the collection to run metadata encryption on.
   * @param {ResourceTypesCollection} resourceTypesV5 The resource types to encrypt the metadata for.
   * @param {openpgp.PrivateKey} userDecryptedPrivateKey The user decrypted private key
   * @returns {Promise<void>}
   */
  async encryptAllFromForeignModelsWithSharedKey(collection, resourceTypesV5, userDecryptedPrivateKey) {
    const {metadataKeyId, metadataPublicKey, metadataPrivateKey} = await this.getLatestMetadataKeysAndId();

    for (const entity of collection) {
      // If resource type v4, nothing to do.
      if (!resourceTypesV5.getFirstById(entity.resourceTypeId)) {
        return;
      }
      // Already encrypted with the user private key, nothing to do.
      if (!entity.isMetadataDecrypted()) {
        continue;
      }

      const serializedMetadata = JSON.stringify(entity.metadata.toDto());
      const encryptedMetadata = await EncryptMessageService.encrypt(serializedMetadata, metadataPublicKey, [userDecryptedPrivateKey, metadataPrivateKey]);
      entity.metadataKeyId = metadataKeyId;
      entity.metadataKeyType = ResourceEntity.METADATA_KEY_TYPE_METADATA_KEY;
      entity.metadata = encryptedMetadata;
    }
  }

  /**
   * Encrypt the metadata of all entities in the collection with the user's private key, and
   * mutates the entities with the encrypted metadata.
   * @param {ResourcesCollection|FoldersCollection} collection the collection to run metadata decryption on.
   * @param {ResourceTypesCollection} resourceTypesV5 The resource types to encrypt the metadata for.
   * @param {openpgp.PrivateKey} userDecryptedPrivateKey The user decrypted user private key
   * @returns {Promise<void>}
   */
  async encryptAllFromForeignModelsWithUserKey(collection, resourceTypesV5, userDecryptedPrivateKey) {
    const userPublicKey = await OpenpgpAssertion.readKeyOrFail(this.account.userPublicArmoredKey);

    for (const entity of collection) {
      if (!entity.isPersonal()) {
        continue;
      }
      // If resource type v4, nothing to do.
      if (!resourceTypesV5.getFirstById(entity.resourceTypeId)) {
        return;
      }

      const serializedMetadata = JSON.stringify(entity.metadata.toDto());
      const encryptedMetadata = await EncryptMessageService.encrypt(serializedMetadata, userPublicKey, [userDecryptedPrivateKey]);
      entity._props.metadata_key_id = null;
      entity.metadataKeyType = ResourceEntity.METADATA_KEY_TYPE_USER_KEY;
      entity.metadata = encryptedMetadata;
    }
  }


  /**
   * Retrieve the id and keys from latest metadataKeysCollection.
   *
   * @returns {Promise<{id: string, metadataPublicKey: openpgp.PublicKey, metadataPrivateKey: openpgp.PrivateKey>}
   * @private
   */
  async getLatestMetadataKeysAndId() {
    const metadataKeysCollection = await this.getOrFindMetadataKeysService.getOrFindAll();
    const metadataKeyEntity = metadataKeysCollection.getFirstByLatestCreated();

    if (metadataKeyEntity === null) {
      throw new Error("Unable to encrypt the entity metadata, no metadata key found.");
    }
    const metadataPrivateKeyEntity = metadataKeyEntity.metadataPrivateKeys?.items[0];
    if (!metadataPrivateKeyEntity?.isDecrypted) {
      throw new Error("Unable to encrypt the entity metadata, metadata private key is not decrypted.");
    }
    const metadataPublicKey = await OpenpgpAssertion.readKeyOrFail(metadataKeyEntity.armoredKey);
    const metadataPrivateKey = await OpenpgpAssertion.readKeyOrFail(metadataPrivateKeyEntity.data.armoredKey);
    const metadataKeyId = metadataKeyEntity.id;
    return {metadataKeyId, metadataPublicKey, metadataPrivateKey};
  }

  /**
   * Retrieve the user passphrase from the local storage or fail.
   *
   * @returns {Promise<string>}
   * @throws {UserPassphraseRequiredError} if the `passphrase` is not set and cannot be retrieved.
   * @private
   */
  async getPassphraseFromLocalStorageOrFail() {
    const passphrase = await PassphraseStorageService.get();
    if (!passphrase) {
      throw new UserPassphraseRequiredError();
    }
    return passphrase;
  }

  /**
   * Allow usage of personal keys
   * @returns {Promise<boolean>}
   */
  async allowUsageOfPersonalKeys() {
    const metadataKeysSettingsEntity = await this.getOrFindMetadataSettingsService.getOrFindKeysSettings();
    return metadataKeysSettingsEntity.allowUsageOfPersonalKeys;
  }
}

export default EncryptMetadataService;
