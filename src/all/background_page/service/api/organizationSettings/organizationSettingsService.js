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
 * @since         3.2.0
 */
import AbstractService from "../abstract/abstractService";

const ORGANIZATION_SETTINGS_SERVICE_RESOURCE_NAME = 'settings';

class OrganizationSettingsService extends AbstractService {
  /**
   * Constructor
   *
   * @param {ApiClientOptions} apiClientOptions
   * @public
   */
  constructor(apiClientOptions) {
    super(apiClientOptions, OrganizationSettingsService.RESOURCE_NAME);
  }

  /**
   * API Resource Name
   *
   * @returns {string}
   * @public
   */
  static get RESOURCE_NAME() {
    return ORGANIZATION_SETTINGS_SERVICE_RESOURCE_NAME;
  }

  /**
   * Find the settings
   *
   * @returns {Promise<*>} response body
   * @throws {Error} if options are invalid or API error
   * @public
   */
  async find() {
    const response = await this.apiClient.findAll();
    const body = JSON.parse(JSON.stringify(response.body));
    body.serverTimeDiff = null;
    if (response.header.servertime) {
      const currentTime = new Date();
      body.serverTimeDiff = (response.header.servertime * 1000) - currentTime.getTime();
    }
    return body;
  }
}

export default OrganizationSettingsService;
