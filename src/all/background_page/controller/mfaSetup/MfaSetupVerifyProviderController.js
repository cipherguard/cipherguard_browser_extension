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

import MfaProviderEntity from "../../model/entity/mfa/mfaProviderEntity";
import MultiFactorAuthenticationModel from "../../model/multiFactorAuthentication/multiFactorAuthenticationModel";


class MfaSetupVerifyProviderController {
  /**
   * MfaSetupVerifyOtpCodeController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   */
  constructor(worker, requestId, apiClientOptions) {
    this.worker = worker;
    this.requestId = requestId;
    this.multiFactorAuthenticationModel = new MultiFactorAuthenticationModel(apiClientOptions);
  }

  /**
   * Controller executor.
   * @param   {string} provider the provider
   * @returns {Promise<bool>}
   */
  async _exec(providerDto) {
    try {
      const response = await this.exec(providerDto);
      this.worker.port.emit(this.requestId, "SUCCESS", response);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Check and save the otp code
   * @param  {Object} provider the provider
   * @throws {Error} if the provider is missing
   * @throws {TypeError} if the provider is not part of the enum
   */
  async exec(providerDto) {
    const providerEntity = new MfaProviderEntity(providerDto);
    return await this.multiFactorAuthenticationModel.verifyProvider(providerEntity);
  }
}

export default MfaSetupVerifyProviderController;
