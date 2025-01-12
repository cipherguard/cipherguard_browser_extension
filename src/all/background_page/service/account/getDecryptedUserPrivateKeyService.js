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
import Keyring from "../../model/keyring";
import DecryptPrivateKeyService from "../crypto/decryptPrivateKeyService";


class GetDecryptedUserPrivateKeyService {
  /**
   * Get current user's private key and decrypts it.
   *
   * @param {string} passphrase The user's private key passphrase to decrypt to key.
   * @returns {Promise<openpgp.PrivateKey>}
   */
  static async getKey(passphrase) {
    const keyring = new Keyring();
    const userPrivateArmoredKey = keyring.findPrivate()?.armoredKey;
    if (!userPrivateArmoredKey) {
      throw new Error("Can't find current user's private key.");
    }
    const key = await OpenpgpAssertion.readKeyOrFail(userPrivateArmoredKey);
    return DecryptPrivateKeyService.decrypt(key, passphrase);
  }
}

export default GetDecryptedUserPrivateKeyService;
