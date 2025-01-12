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
 * @since         4.4.0
 */
import AbstractService from "../abstract/abstractService";

const PASSWORD_EXPIRY_SETTINGS_RESOURCE_NAME = 'password-expiry/settings';

class PasswordExpirySettingsService extends AbstractService {
  /**
   * Constructor
   *
   * @param {ApiClientOptions} apiClientOptions
   * @public
   */
  constructor(apiClientOptions) {
    super(apiClientOptions, PasswordExpirySettingsService.RESOURCE_NAME);
  }

  /**
   * Get settings for password-expiry.
   * @returns {Promise<Object>} Response body
   * @public
   */
  async find() {
    const setting = await this.apiClient.findAll();
    return setting.body;
  }

  /**
   * Create password-expiry settings on the API.
   * @param {Object} data the settings to save
   * @returns {Promise<Object>} Response body
   * @public
   */
  async create(data) {
    this.assertNonEmptyData(data);
    const setting = await this.apiClient.create(data);
    return setting.body;
  }

  /**
   * Delete the given password-expiry settings.
   * @param {Object} data the settings to save
   * @returns {Promise<Object>} Response body
   * @public
   */
  async delete(passwordExpirySettingsId) {
    await this.apiClient.delete(passwordExpirySettingsId);
  }

  /**
   * API Resource Name
   *
   * @returns {string}
   * @public
   */
  static get RESOURCE_NAME() {
    return PASSWORD_EXPIRY_SETTINGS_RESOURCE_NAME;
  }
}

export default PasswordExpirySettingsService;
