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

class SignGpgKeyService {
  /**
   * Signs a key.
   *
   * @param {openpgp.PublicKey} publicKeyToSign The public key to sign.
   * @param {Array<openpgp.PrivateKey>} signingKeys The key(s) to use to sign.
   * @returns {Promise<openpgp.PublicKey>}
   */
  static async sign(publicKeyToSign, signingKeys) {
    OpenpgpAssertion.assertPublicKey(publicKeyToSign);
    OpenpgpAssertion.assertDecryptedPrivateKeys(signingKeys);
    return publicKeyToSign.signAllUsers(signingKeys);
  }
}

export default SignGpgKeyService;
