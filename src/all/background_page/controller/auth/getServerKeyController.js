/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SARL (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.7.0
 */
import AuthVerifyServerKeyService from "../../service/api/auth/authVerifyServerKeyService";

class GetServerKeyController {
  /**
   * AuthVerifyServerKeyController Constructor
   *
   * @param {Worker} worker
   * @param {string} requestId
   * @param {ApiClientOptions} apiClientOptions
   */
  constructor(worker, requestId, apiClientOptions) {
    this.worker = worker;
    this.requestId = requestId;
    this.authVerifyServerKeyService = new AuthVerifyServerKeyService(apiClientOptions);
  }

  /**
   * Controller executor.
   * @returns {Promise<void>}
   */
  async _exec() {
    try {
      const serverKey = await this.exec();
      this.worker.port.emit(this.requestId, 'SUCCESS', serverKey);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Perform a GPGAuth verify
   *
   * @returns {Promise<{armored_key: string, fingerprint: string}>}
   */
  async exec() {
    return this.authVerifyServerKeyService.getServerKey();
  }
}

export default GetServerKeyController;
