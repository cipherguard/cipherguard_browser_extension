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
 * @since         4.2.0
 */

import UserRememberMeLatestChoiceLocalStorage from "../../service/local_storage/userRememberMeLatestChoiceLocalStorage";

class GetUserRememberMeLatestChoiceController {
  /**
   * Constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   * @param {AccountEntity} account The account associated to the worker.
   */
  constructor(worker, requestId, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.userRememberMeLatestChoiceLocalStorage = new UserRememberMeLatestChoiceLocalStorage(account);
  }

  /**
   * Controller executor.
   * @returns {Promise<void>}
   */
  async _exec() {
    try {
      const result = await this.exec.apply(this, arguments);
      this.worker.port.emit(this.requestId, 'SUCCESS', result);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Find the last user's rememberMe choice
   * @return {Promise<Boolean>}
   */
  async exec() {
    //@todo: see to use the duration instead of a boolean
    const entity = await this.userRememberMeLatestChoiceLocalStorage.get();
    return entity?.duration === -1;
  }
}

export default GetUserRememberMeLatestChoiceController;
