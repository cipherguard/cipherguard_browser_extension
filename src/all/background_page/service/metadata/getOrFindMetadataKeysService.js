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

import FindAndUpdateMetadataKeysSessionStorageService from "./findAndUpdateMetadataKeysSessionStorageService";
import MetadataKeysSessionStorage from "../session_storage/metadataKeysSessionStorage";
import MetadataKeysCollection from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeysCollection";

/**
 * The service aims to get metadata keys from the local storage, or to retrieve them from the API and store them in the session storage.
 */
export default class GetOrFindMetadataKeysService {
  /**
   * @constructor
   * @param {AccountEntity} account The user account
   * @param {ApiClientOptions} apiClientOptions The api client options
   */
  constructor(account, apiClientOptions) {
    this.findAndUpdateMetadataKeysService = new FindAndUpdateMetadataKeysSessionStorageService(account, apiClientOptions);
    this.metadataKeysSessionStorage = new MetadataKeysSessionStorage(account);
  }

  /**
   * Get the metadata keys from the session storage, or retrieve them from the API and update the session storage.
   * @returns {Promise<MetadataKeysCollection>}
   */
  async getOrFindAll() {
    const metadataKeys = await this.metadataKeysSessionStorage.get();
    if (metadataKeys) {
      return new MetadataKeysCollection(metadataKeys);
    }

    return this.findAndUpdateMetadataKeysService.findAndUpdateAll();
  }
}
