/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2021 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2021 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.0.6
 */
import RoleModel from "../model/role/roleModel";

/**
 * Listens the role events
 * @param {Worker} worker
 * @param {ApiClientOptions} apiClientOptions the api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * Get the resource types from the local storage.
   *
   * @listens cipherguard.resource-type.get-all
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.role.get-all', async requestId => {
    try {
      const roleModel = new RoleModel(apiClientOptions);
      const roles = await roleModel.getOrFindAll();
      worker.port.emit(requestId, 'SUCCESS', roles);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};

export const RoleEvents = {listen};
