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

class VerifyGpgKeyService {
  /**
   * Verify a key signatures.
   *
   * @param {openpgp.PublicKey|openpgp.PrivateKey} keyToVerify The key to verify.
   * @param {Array<openpgp.PublicKey|openpgp.PrivateKey>} verifyingKeys The key(s) to verify the signature for.
   * @returns {Promise<boolean>}
   */
  static async verify(keyToVerify, verifyingKeys) {
    OpenpgpAssertion.assertKey(keyToVerify);
    OpenpgpAssertion.assertKeys(verifyingKeys);

    const result = await keyToVerify.verifyAllUsers(verifyingKeys);
    const signaturesVerifiedCount = result.filter(item => item.valid).length;
    return signaturesVerifiedCount === verifyingKeys.length;
  }
}

export default VerifyGpgKeyService;
