/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SARL (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SARL (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.2.0
 */
import User from "../model/user";
import OrganizationSettingsModel from "../model/organizationSettings/organizationSettingsModel";


const listen = function(worker) {
  /*
   * Get the organization settings.
   *
   * @listens cipherguard.organization-settings.get
   * @param requestId {uuid} The request identifier
   * @param refreshCache {boolean} Should refresh the cache, default true
   */
  worker.port.on('cipherguard.organization-settings.get', async(requestId, refreshCache = true) => {
    try {
      const apiClientOptions = await User.getInstance().getApiClientOptions();
      const organizationSettingsModel = new OrganizationSettingsModel(apiClientOptions);
      const organizationSettings = await organizationSettingsModel.getOrFind(refreshCache);
      worker.port.emit(requestId, 'SUCCESS', organizationSettings);
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};
export const OrganizationSettingsEvents = {listen};
