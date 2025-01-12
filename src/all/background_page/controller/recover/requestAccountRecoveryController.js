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

import AccountRecoveryModel from "../../model/accountRecovery/accountRecoveryModel";
import AccountModel from "../../model/account/accountModel";
import AccountLocalStorage from "../../service/local_storage/accountLocalStorage";
import AccountRecoveryRequestService from "../../service/api/accountRecovery/accountRecoveryRequestService";
import AccountRecoveryRequestCreateEntity from "../../model/entity/accountRecovery/accountRecoveryRequestCreateEntity";
import AccountRecoverEntity from "../../model/entity/account/accountRecoverEntity";
import AccountAccountRecoveryEntity from "../../model/entity/account/accountAccountRecoveryEntity";
import AccountTemporarySessionStorageService from "../../service/sessionStorage/accountTemporarySessionStorageService";
import FindAccountTemporaryService from "../../service/account/findAccountTemporaryService";

class RequestAccountRecoveryController {
  /**
   * Constructor.
   * @param {Worker} worker The associated worker.
   * @param {ApiClientOptions} apiClientOptions The api client options.
   * @param {string} requestId The associated request id.
   */
  constructor(worker, apiClientOptions, requestId) {
    this.worker = worker;
    this.requestId = requestId;
    this.accountModel = new AccountModel(apiClientOptions);
    this.accountRecoveryModel = new AccountRecoveryModel(apiClientOptions);
    this.accountRecoveryRequestService = new AccountRecoveryRequestService(apiClientOptions);
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
   * Create account recovery
   * @returns {Promise<void>}
   */
  async exec() {
    const temporaryAccount = await FindAccountTemporaryService.exec(this.worker.port._port.name);
    const accountRecoveryRequestDto = temporaryAccount.account.toAccountRecoveryRequestDto();
    const accountRecoverRequestCreate = new AccountRecoveryRequestCreateEntity(accountRecoveryRequestDto);
    const accountRecoveryRequest = await this.accountRecoveryRequestService.create(accountRecoverRequestCreate);

    const accountAccountRecoveryDto = temporaryAccount.account.toDto(AccountRecoverEntity.ALL_CONTAIN_OPTIONS);
    accountAccountRecoveryDto.account_recovery_request_id = accountRecoveryRequest.id;
    const accountAccountRecovery = new AccountAccountRecoveryEntity(accountAccountRecoveryDto);

    // Delete any existing account recovery request temporary accounts, as the API will anyway cancel other on going requests.
    await AccountLocalStorage.deleteByUserIdAndType(accountAccountRecovery.userId, AccountAccountRecoveryEntity.TYPE_ACCOUNT_ACCOUNT_RECOVERY);
    await AccountLocalStorage.add(accountAccountRecovery);
    await AccountTemporarySessionStorageService.remove();
  }
}

export default RequestAccountRecoveryController;
