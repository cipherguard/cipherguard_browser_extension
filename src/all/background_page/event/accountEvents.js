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
import GetAccountController from "../controller/account/getAccountController";

/**
 * Listens to the account recovery continue application events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 * @param {AccountEntity} account The account completing the account recovery
 */
const listen = function(worker, apiClientOptions, account) {
  worker.port.on('cipherguard.account.get', async requestId => {
    const controller = new GetAccountController(worker, requestId, account);
    await controller._exec();
  });
};

export const AccountEvents = {listen};
