/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.6.0
 */

import AccountModel from "../../model/account/accountModel";
import SetupModel from "../../model/setup/setupModel";
import AccountRecoverEntity from "../../model/entity/account/accountRecoverEntity";
import AccountEntity from "../../model/entity/account/accountEntity";
import FindAccountTemporaryService from "../../service/account/findAccountTemporaryService";

class CompleteRecoverController {
  /**
   * Constructor.
   * @param {Worker} worker The associated worker.
   * @param {string} requestId The associated request id.
   * @param {ApiClientOptions} apiClientOptions The api client options.
   */
  constructor(worker, requestId, apiClientOptions) {
    this.worker = worker;
    this.requestId = requestId;
    this.accountModel = new AccountModel(apiClientOptions);
    this.setupModel = new SetupModel(apiClientOptions);
  }

  /**
   * Controller executor.
   * @returns {Promise<void>}
   */
  async _exec() {
    try {
      await this.exec();
      this.worker.port.emit(this.requestId, 'SUCCESS');
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Complete the recover:
   * - Complete the recover.
   * - Set the extension account in the local storage.
   * @returns {Promise<void>}
   */
  async exec() {
    const temporaryAccount = await FindAccountTemporaryService.exec(this.worker.port._port.name);
    const accountRecovered = new AccountEntity(temporaryAccount.account.toDto(AccountRecoverEntity.ALL_CONTAIN_OPTIONS));
    await this.setupModel.completeRecover(temporaryAccount.account);
    await this.accountModel.add(accountRecovered);
  }
}

export default CompleteRecoverController;
