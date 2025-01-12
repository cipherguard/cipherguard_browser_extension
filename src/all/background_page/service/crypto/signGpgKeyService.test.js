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
import SignGpgKeyService from "./signGpgKeyService";
import {pgpKeys} from 'cipherguard-styleguide/test/fixture/pgpKeys/keys';
import {OpenpgpAssertion} from '../../utils/openpgp/openpgpAssertions';

describe("SignGpgKey service", () => {
  it("should sign a given public key with as many as private key provided", async() => {
    expect.assertions(2);

    const keyToSign = await OpenpgpAssertion.readKeyOrFail(pgpKeys.admin.public);
    const bettyDecryptedKey = await OpenpgpAssertion.readKeyOrFail(pgpKeys.betty.private_decrypted);
    const adaDecryptedKey = await OpenpgpAssertion.readKeyOrFail(pgpKeys.ada.private_decrypted);
    const signingKey = [bettyDecryptedKey, adaDecryptedKey];

    const adminSignedPublicGpgKey = await SignGpgKeyService.sign(keyToSign, signingKey);
    const signatures = await adminSignedPublicGpgKey.verifyAllUsers(signingKey);
    const keyExistsInList = (keys, keyID) => {
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].keyID === keyID) {
          return true;
        }
      }
      return false;
    };

    expect(keyExistsInList(signatures, bettyDecryptedKey.getKeyID())).toBe(true);
    expect(keyExistsInList(signatures, adaDecryptedKey.getKeyID())).toBe(true);
  });
});
