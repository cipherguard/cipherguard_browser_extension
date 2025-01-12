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
 * @since         3.11.0
 */
import PownedPasswordController from '../controller/secret/pownedPasswordController';

const listen = function(worker) {
  /*
   * Check if password is powned
   *
   * @listens cipherguard.secrets.powned-password
   * @param requestId {uuid} The request identifier
   * @param password {string} the password to check
   */
  worker.port.on('cipherguard.secrets.powned-password', async(requestId, password) => {
    const controller = new PownedPasswordController(worker, requestId);
    await controller._exec(password);
  });
};

export const PownedPasswordEvents = {listen};
