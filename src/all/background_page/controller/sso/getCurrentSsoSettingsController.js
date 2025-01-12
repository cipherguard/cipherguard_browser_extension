
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
 * @since         3.9.0
 */
import SsoSettingsModel from "../../model/sso/ssoSettingsModel";

class GetCurrentSsoSettingsController {
  /**
   * GetCurrentSsoSettingsController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   */
  constructor(worker, requestId, apiClientOptions) {
    this.worker = worker;
    this.requestId = requestId;
    this.ssoSettingsModel = new SsoSettingsModel(apiClientOptions);
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @param {uuid} draftSsoSettingsId the draft sso settings id
   * @return {Promise<void>}
   */
  async _exec() {
    try {
      const ssoSettings = await this.exec();
      this.worker.port.emit(this.requestId, "SUCCESS", ssoSettings);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, "ERROR", error);
    }
  }

  /**
   * Returns the current active SSO settings registered from the API.
   *
   * @return {Promise<SsoSettingsEntity>}
   */
  async exec() {
    const contains = {data: true};
    return this.ssoSettingsModel.getCurrent(contains);
  }
}

export default GetCurrentSsoSettingsController;
