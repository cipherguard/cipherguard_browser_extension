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
import ParseSetupUrlService from "../service/setup/parseSetupUrlService";
import {PortEvents} from "../event/portEvents";

class SetupBootstrap extends Pagemod {
  /**
   * @inheritDoc
   * @returns {string}
   */
  get appName() {
    return "SetupBootstrap";
  }

  /**
   * @inheritDoc
   */
  get contentStyleFiles() {
    return ['webAccessibleResources/css/themes/default/ext_external.min.css'];
  }

  /**
   * @inheritDoc
   */
  get contentScriptFiles() {
    return [
      'contentScripts/js/dist/vendors.js',
      'contentScripts/js/dist/setup.js',
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
      && this.assertUrlAttachConstraint(frameDetails);
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
    return ParseSetupUrlService.test(frameDetails.url);
  }
}

export default new SetupBootstrap();
