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
import MetadataTypesSettingsLocalStorage from "../local_storage/metadataTypesSettingsLocalStorage";
import FindAndUpdateMetadataSettingsLocalStorageService from "./findAndUpdateMetadataSettingsLocalStorageService";
import MetadataTypesSettingsEntity
  from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity";
import MetadataKeysSettingsLocalStorage from "../local_storage/metadataKeysSettingsLocalStorage";
import MetadataKeysSettingsEntity
  from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeysSettingsEntity";

/**
 * The service aims to get metadata settings from the local storage, or to retrieve them from the API and store them in the local storage.
 */
export default class GetOrFindMetadataSettingsService {
  /**
   * @constructor
   * @param {AccountEntity} account The user account
   * @param {ApiClientOptions} apiClientOptions The api client options
   */
  constructor(account, apiClientOptions) {
    this.findAndUpdateMetadataSettingsLocalStorageService = new FindAndUpdateMetadataSettingsLocalStorageService(account, apiClientOptions);
    this.metadataTypesSettingsLocalStorage = new MetadataTypesSettingsLocalStorage(account);
    this.metadataKeysSettingsLocalStorage = new MetadataKeysSettingsLocalStorage(account);
  }

  /**
   * Get the metadata types settings from the local storage, or retrieve them from the API and update the local storage.
   * @returns {Promise<MetadataTypesSettingsEntity>}
   */
  async getOrFindTypesSettings() {
    const metadataTypesSettingsDto = await this.metadataTypesSettingsLocalStorage.get();
    if (metadataTypesSettingsDto) {
      return MetadataTypesSettingsEntity.createFromDefault(metadataTypesSettingsDto);
    }

    return this.findAndUpdateMetadataSettingsLocalStorageService.findAndUpdateTypesSettings();
  }

  /**
   * Get the metadata keys settings from the local storage, or retrieve them from the API and update the local storage.
   * @returns {Promise<MetadataKeysSettingsEntity>}
   */
  async getOrFindKeysSettings() {
    const metadataKeysSettingsDto = await this.metadataKeysSettingsLocalStorage.get();
    if (metadataKeysSettingsDto) {
      return MetadataKeysSettingsEntity.createFromDefault(metadataKeysSettingsDto);
    }

    return this.findAndUpdateMetadataSettingsLocalStorageService.findAndUpdateKeysSettings();
  }
}
