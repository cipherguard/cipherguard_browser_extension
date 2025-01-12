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
import {PortEvents} from "../event/portEvents";
import ParseAccountRecoveryUrlService
  from "../service/accountRecovery/parseAccountRecoveryUrlService";
import GetRequestLocalAccountService from "../service/accountRecovery/getRequestLocalAccountService";

class AccountRecoveryBootstrap extends Pagemod {
  /**
   * @inheritDoc
   * @returns {string}
   */
  get appName() {
    return "AccountRecoveryBootstrap";
  }

  /**
   * @inheritDoc
   */
  get contentScriptFiles() {
    return [
      'contentScripts/js/dist/vendors.js',
      'contentScripts/js/dist/account-recovery.js',
    ];
  }

  /**
   * @inheritDoc
   */
  get events() {
    return [PortEvents];
  }

  /**
   * @inheritDoc
   */
  get mustReloadOnExtensionUpdate() {
    return true;
  }

  /**
   * @inheritDoc
   */
  async canBeAttachedTo(frameDetails) {
    return this.assertTopFrameAttachConstraint(frameDetails)
      && this.assertUrlAttachConstraint(frameDetails)
      && this.assertAccountInLocalStorage(frameDetails);
  }

  /**
   * Assert that the attached frame is a top frame.
   * @param {Object} frameDetails
   * @returns {boolean}
   */
  assertTopFrameAttachConstraint(frameDetails) {
    return frameDetails.frameId === Pagemod.TOP_FRAME_ID;
  }

  /**
   * Assert that the attached frame is a top frame.
   * @param {Object} frameDetails
   * @returns {boolean}
   */
  assertUrlAttachConstraint(frameDetails) {
    return ParseAccountRecoveryUrlService.test(frameDetails.url);
  }

  /**
   * Assert that the account is in the local storage.
   * @param {Object} frameDetails
   * @returns {Promise<boolean>}
   */
  async assertAccountInLocalStorage(frameDetails) {
    try {
      return Boolean(await GetRequestLocalAccountService.getAccountMatchingContinueUrl(frameDetails.url));
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default new AccountRecoveryBootstrap();
