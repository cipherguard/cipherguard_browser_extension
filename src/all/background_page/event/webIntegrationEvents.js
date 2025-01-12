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
import WebIntegrationController from "../controller/webIntegration/webIntegrationController";
import RemovePortController from "../controller/port/removePortController";

/**
 * Listens the web integration events
 * @param worker
 */
const listen = function(worker) {
  /*
   * Whenever the auto-save is required
   * @listens cipherguard.web-integration.autosave
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.web-integration.autosave', async resourceToSave => {
    const webIntegrationController = new WebIntegrationController(worker);
    await webIntegrationController.autosave(resourceToSave);
  });

  /** Whenever the in-form-menu or in-call-to-action are removed */
  worker.port.on('cipherguard.port.disconnect', async applicationName => {
    const removePortController = new RemovePortController(worker);
    await removePortController._exec(applicationName);
  });
};

export const WebIntegrationEvents = {listen};
