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
 */
import PostLogoutService from '../service/auth/postLogoutService';

/**
 * Listens to the application bootstrap events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 * @param {AccountAccountRecoveryEntity} account The account completing the account recovery
 */
const listen = function(worker, apiClientOptions, account) {
  /*
   * Navigate to logout
   *
   * @listens cipherguard.app-boostrap.navigate-to-logout
   * @deprecated will be removed with v4. Helps to support legacy appjs logout.
   */
  worker.port.on('cipherguard.app-boostrap.navigate-to-logout', async() => {
    const url = `${account.domain}/auth/logout`;

    try {
      await chrome.tabs.update(worker.tab.id, {url: url});
      await PostLogoutService.exec();
    } catch (error) {
      console.error(error);
    }
  });
};
export const AppBootstrapEvents = {listen};
