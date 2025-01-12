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
 * @since         3.10.0
 */

import AbstractService from "../abstract/abstractService";

const USER_SERVICE_RESOURCE_NAME = 'mfa-policies';

class MultiFactorAuthenticationPolicyService extends AbstractService {
  /**
   * Constructor
   *
   * @param {ApiClientOptions} apiClientOptions
   * @public
   */
  constructor(apiClientOptions) {
    super(apiClientOptions, MultiFactorAuthenticationPolicyService.RESOURCE_NAME);
  }

  /**
   * API Resource Name
   *
   * @returns {string}
   * @public
   */
  static get RESOURCE_NAME() {
    return USER_SERVICE_RESOURCE_NAME;
  }

  /**
   * get settings for mfa-policy
   *
   * @returns {Promise<*>} Response body
   * @public
   */
  async find() {
    const url = this.apiClient.buildUrl(`${this.apiClient.baseUrl}/settings`);
    const setting = await this.apiClient.fetchAndHandleResponse('GET', url);
    return setting.body;
  }
}

export default MultiFactorAuthenticationPolicyService;
