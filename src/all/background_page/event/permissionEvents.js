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
 * @since         4.9.4
 */

import FindAcoPermissionsForDisplayController from "../controller/permission/FindAcoPermissionsForDisplayController";

/**
 * Listens the permission events
 * @param {Worker} worker
 * @param {ApiClientOptions} apiClientOptions
 * @param {AccountEntity} account the user account
 */
const listen = function(worker, apiClientOptions, account) {
  /*
   * Find a resource with complete permissions
   *
   * @listens cipherguard.resources.find-for-permissions
   * @param acoId {uuid} The aco id
   * @param acoType {string} The aco type (Resource or Folder)
   */
  worker.port.on('cipherguard.permissions.find-aco-permissions-for-display', async(requestId, acoId, acoType) => {
    const controller = new FindAcoPermissionsForDisplayController(worker, requestId, apiClientOptions, account);
    await controller._exec(acoId, acoType);
  });
};

export const PermissionEvents = {listen};
