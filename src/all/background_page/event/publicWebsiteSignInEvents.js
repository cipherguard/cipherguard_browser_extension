
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
 * @since         3.7.0
 */
import PublicWebsiteSignInController from "../controller/publicWebsiteSignIn/publicWebsiteSignInController";

/**
 * Listens the public website sign in events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} _
 * @param {AccountEntity} account The account completing the account recovery
 */
const listen = function(worker, _, account) {
  worker.port.on('cipherguard.extension.sign-in-url', async requestId => {
    const controller = new PublicWebsiteSignInController(worker, requestId, account);
    await controller._exec();
  });
};

export const PublicWebsiteSignInEvents = {listen};
