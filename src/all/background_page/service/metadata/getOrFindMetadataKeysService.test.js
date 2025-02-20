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

import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import GetOrFindMetadataKeysService from "./getOrFindMetadataKeysService";
import {v4 as uuidv4} from "uuid";
import {
  defaultMetadataPrivateKeyDto
} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataPrivateKeyEntity.test.data";
import {defaultMetadataKeyDto} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeyEntity.test.data";
import MetadataKeyEntity from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeyEntity";
import {pgpKeys} from "cipherguard-styleguide/test/fixture/pgpKeys/keys";
import PassphraseStorageService from "../session_storage/passphraseStorageService";
import MetadataKeysCollection from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeysCollection";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GetOrFindMetadataKeysService", () => {
  let getOrFindMetadataKeysService, account, apiClientOptions;

  beforeEach(async() => {
    account = new AccountEntity(defaultAccountDto());
    apiClientOptions = defaultApiClientOptions();
    getOrFindMetadataKeysService = new GetOrFindMetadataKeysService(account, apiClientOptions);
    // flush account related storage before each.
    getOrFindMetadataKeysService.metadataKeysSessionStorage.flush();
  });

  describe("::getOrFindMetadataTypesSettings", () => {
    it("with empty storage, retrieves the metadata types settings from the API and store them into the session storage.", async() => {
      expect.assertions(3);

      const id = uuidv4();
      const metadata_private_keys = [defaultMetadataPrivateKeyDto({metadata_key_id: id, data: pgpKeys.metadataKey.encryptedMetadataPrivateKeyDataMessage})];
      const apiMetadataKeysCollectionDto = [defaultMetadataKeyDto({id, metadata_private_keys})];
      const expectedMetadataKeysDto = JSON.parse(JSON.stringify(apiMetadataKeysCollectionDto));
      expectedMetadataKeysDto[0].metadata_private_keys[0].data = JSON.parse(pgpKeys.metadataKey.decryptedMetadataPrivateKeyData);

      jest.spyOn(getOrFindMetadataKeysService.findAndUpdateMetadataKeysService.findMetadataKeysService.metadataKeysApiService, "findAll")
        .mockImplementation(() => apiMetadataKeysCollectionDto);
      jest.spyOn(PassphraseStorageService, "get").mockImplementation(() => pgpKeys.ada.passphrase);

      // Control initial storage value.
      const initialStorageValue = await getOrFindMetadataKeysService.metadataKeysSessionStorage.get();
      await expect(initialStorageValue).toBeUndefined();

      const collection = await getOrFindMetadataKeysService.getOrFindAll();

      expect(collection.toDto(MetadataKeyEntity.ALL_CONTAIN_OPTIONS)).toEqual(expectedMetadataKeysDto);
      const storageValue = await getOrFindMetadataKeysService.metadataKeysSessionStorage.get();
      await expect(storageValue).toEqual(expectedMetadataKeysDto);
    });

    it("with populated storage, retrieves the metadata keys from the session storage.", async() => {
      expect.assertions(2);
      const id = uuidv4();
      const metadata_private_keys = [defaultMetadataPrivateKeyDto({metadata_key_id: id, data: pgpKeys.metadataKey.encryptedMetadataPrivateKeyDataMessage})];
      const metadataKeysCollectionDto = [defaultMetadataKeyDto({id, metadata_private_keys})];
      metadataKeysCollectionDto[0].metadata_private_keys[0].data = JSON.parse(pgpKeys.metadataKey.decryptedMetadataPrivateKeyData);

      await getOrFindMetadataKeysService.metadataKeysSessionStorage.set(new MetadataKeysCollection(metadataKeysCollectionDto));
      jest.spyOn(getOrFindMetadataKeysService.findAndUpdateMetadataKeysService.findMetadataKeysService.metadataKeysApiService, "findAll");

      const collection = await getOrFindMetadataKeysService.getOrFindAll();

      expect(getOrFindMetadataKeysService.findAndUpdateMetadataKeysService.findMetadataKeysService.metadataKeysApiService.findAll)
        .not.toHaveBeenCalled();
      expect(collection.toDto(MetadataKeyEntity.ALL_CONTAIN_OPTIONS)).toEqual(metadataKeysCollectionDto);
    });
  });
});
