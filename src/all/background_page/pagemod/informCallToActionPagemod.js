/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.0.0
 */
import Pagemod from "./pagemod";
import {InformCallToActionEvents} from "../event/informCallToActionEvents";
import BuildApiClientOptionsService from "../service/account/buildApiClientOptionsService";
import GetActiveAccountService from "../service/account/getActiveAccountService";

class InFormCallToAction extends Pagemod {
  /**
   * @inheritDoc
   * @returns {string}
   */
  get appName() {
    return "InFormCallToAction";
  }

  /**
   * @inheritDoc
   */
  get events() {
    return [InformCallToActionEvents];
  }

  /**
   * @inheritDoc
   */
  async attachEvents(port) {
    try {
      const tab = port._port.sender.tab;
      const account = await GetActiveAccountService.get();
      const apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
      const name = this.appName;
      for (const event of this.events) {
        event.listen({port, tab, name}, apiClientOptions, account);
      }
    } catch (error) {
      /*
       * Ensure the application does not crash completely if the legacy account cannot be retrieved.
       * The following controllers won't work as expected:
       * - RequestHelpCredentialsLostController
       */
      console.error('InFormMenu::attach legacy account cannot be retrieved, please contact your administrator.');
      console.error(error);
    }
  }
}

export default new InFormCallToAction();
