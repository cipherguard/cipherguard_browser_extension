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
 * @since         3.6.0
 */

import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";
import DecryptPrivateKeyService from "../../service/crypto/decryptPrivateKeyService";
import AccountTemporarySessionStorageService from "../../service/sessionStorage/accountTemporarySessionStorageService";
import FindAccountTemporaryService from "../../service/account/findAccountTemporaryService";

class VerifyImportedKeyPassphraseController {
  /**
   * Constructor.
   * @param {Worker} worker The associated worker.
   * @param {string} requestId The associated request id.
   */
  constructor(worker, requestId) {
    this.worker = worker;
    this.requestId = requestId;
  }

  /**
   * Controller executor.
   * @param {string} passphrase The passphrase with which to check setup's private key decryption
   * @returns {Promise<void>}
   */
  async _exec(passphrase) {
    try {
      await this.exec(passphrase);
      this.worker.port.emit(this.requestId, 'SUCCESS');
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Verify the imported key passphrase and store the passphrase in the runtime memory.
   * @param {string} passphrase The passphrase.
   * @throws {Error} if the account does not have a user private key yet defined.
   * @throws {TypeError} if the passphrase is not a valid string.
   * @throws {InvalidMasterPasswordError} if the passphrase can't be used to decrypt the account user private key.
   * @returns {Promise<void>}
   */
  async exec(passphrase) {
    const temporaryAccount = await FindAccountTemporaryService.exec(this.worker.port._port.name);
    const privateArmoredKey = temporaryAccount.account?.userPrivateArmoredKey;
    if (!privateArmoredKey) {
      throw new Error('An account user private key is required.');
    }
    if (typeof passphrase !== "string") {
      throw new TypeError("The passphrase should be a string.");
    }
    const privateKey = await OpenpgpAssertion.readKeyOrFail(privateArmoredKey);
    await DecryptPrivateKeyService.decrypt(privateKey, passphrase);
    // The passphrase will be later use to sign in the user.
    temporaryAccount.passphrase = passphrase;
    // Update all data in the temporary account stored
    await AccountTemporarySessionStorageService.set(temporaryAccount);
  }
}

export default VerifyImportedKeyPassphraseController;
