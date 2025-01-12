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

import * as openpgp from 'openpgp';
import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";

class RevokeGpgKeyService {
  /**
   * Revoke a key.
   *
   * @param {openpgp.PrivateKey} privateKeyToRevoke The private key to revoke.
   * @returns {Promise<openpgp.PublicKey>} the revoked public armored key
   */
  static async revoke(privateKeyToRevoke) {
    OpenpgpAssertion.assertDecryptedPrivateKey(privateKeyToRevoke);
    const {publicKey} = await openpgp.revokeKey({
      key: privateKeyToRevoke,
      format: 'object'
    });
    return publicKey;
  }
}

export default RevokeGpgKeyService;
