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
import InformCallToActionController from "../controller/informCallToActionController/informCallToActionController";
import AuthCheckStatusController from "../controller/auth/authCheckStatusController";

/**
 * Listens the inform call to action events
 * @param {Worker} worker
 * @param {ApiClientOptions} apiClientOptions
 * @param {AccountEntity} account the user account
 */
const listen = function(worker, apiClientOptions, account) {
  /*
   * Whenever the in-form call-to-action status is required
   * @listens cipherguard.in-form-cta.check-status
   * @param requestId {uuid} The request identifier
   * @returns {*{isAuthenticated,isMfaRequired}
   */
  worker.port.on('cipherguard.in-form-cta.check-status', async(requestId, flushCache = false) => {
    const authIsAuthenticatedController = new AuthCheckStatusController(worker, requestId);
    await authIsAuthenticatedController._exec(flushCache);
  });

  /*
   * Whenever the in-form call-to-action suggested resources is required
   * @listens cipherguard.in-form-cta.suggested-resources
   * @param requestId {uuid} The request identifier
   * @returns {*[]|number}
   */
  worker.port.on('cipherguard.in-form-cta.suggested-resources', async requestId => {
    const informCallToActionController = new InformCallToActionController(worker, apiClientOptions, account);
    await informCallToActionController.countSuggestedResourcesCount(requestId);
  });

  /*
   * Whenever the in-form call-to-action is executed
   * @listens cipherguard.in-form-cta.execute
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.in-form-cta.execute', async requestId => {
    const informCallToActionController = new InformCallToActionController(worker, apiClientOptions, account);
    await informCallToActionController.execute(requestId);
  });
};

export const InformCallToActionEvents = {listen};
