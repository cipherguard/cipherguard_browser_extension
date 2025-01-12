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
 * @since         4.9.0
 */
import FindResourcesService from "../../service/resource/findResourcesService";
import {assertUuid} from "../../utils/assertions";

class FindResourceDetailsController {
  /**
   * Constructor.
   * @param {Worker} worker The associated worker.
   * @param {string} requestId The associated request id.
   * @param {ApiClientOptions} apiClientOptions The api client options.
   * @param {AccountEntity} account The account associated to the worker.
   */
  constructor(worker, requestId, apiClientOptions, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.account = account;
    this.findResourcesService = new FindResourcesService(account, apiClientOptions);
  }

  /**
   * Controller executor.
   * @param {string} resourceId
   * @returns {Promise<void>}
   */
  async _exec(resourceId) {
    try {
      const result = await this.exec(resourceId);
      this.worker.port.emit(this.requestId, 'SUCCESS', result);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Abort current request and initiate a new one.
   * @param {string} resourceId
   * @returns {Promise<ResourceEntity>}
   */
  async exec(resourceId) {
    assertUuid(resourceId);
    return this.findResourcesService.findOneByIdForDetails(resourceId);
  }
}

export default FindResourceDetailsController;
