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

import MultiFactorAuthenticationModel from '../../model/multiFactorAuthentication/multiFactorAuthenticationModel';

class MfaGetPolicyController {
  /**
   * MfaGetPolicyController constructor
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
   * @returns {Promise<string>}
   */
  async _exec() {
    try {
      const policy = await this.exec();
      this.worker.port.emit(this.requestId, "SUCCESS", policy);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * retrieve the MFA Policy.
   */
  exec() {
    return this.multiFactorAuthenticationModel.getPolicy();
  }
}

export default MfaGetPolicyController;
