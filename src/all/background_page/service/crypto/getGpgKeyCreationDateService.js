/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.6.3
 */
import OrganizationSettingsModel from "../../model/organizationSettings/organizationSettingsModel";

class GetGpgKeyCreationDateService {
  /**
   * Returns a date that could be used to generate a gpg key
   * while being compatible with both the client and the server.
   *
   * @param {ApiClientOptions} apiClientOptions The api client options.
   * @return {Promise<integer>}
   */
  static async getDate(apiClientOptions) {
    const organizationSettingsModel = new OrganizationSettingsModel(apiClientOptions);

    let organizationSettings;
    try {
      organizationSettings = await organizationSettingsModel.getOrFind();
    } catch (e) {
      console.error(e);
      return (new Date()).getTime();
    }

    return organizationSettings.isServerInPast()
      ? organizationSettings.serverTime
      : (new Date()).getTime();
  }
}

export default GetGpgKeyCreationDateService;
