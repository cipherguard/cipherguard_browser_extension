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
 * @since         4.10.1
 */

import {OpenpgpAssertion} from "../../src/all/background_page/utils/openpgp/openpgpAssertions";
import DecryptMessageService from "../../src/all/background_page/service/crypto/decryptMessageService";

exports.toDecryptAndEqualTo = async function(armoredMessage, armoredPrivateKey, expectedMessage, verificationArmoredKey = null) {
  const {matcherHint} = this.utils;

  let pass, errorCause, decryptedMessage;
  try {
    const message = await OpenpgpAssertion.readMessageOrFail(armoredMessage);
    const privateKey = await OpenpgpAssertion.readKeyOrFail(armoredPrivateKey);
    const verificationKeys = verificationArmoredKey ? [await OpenpgpAssertion.readKeyOrFail(verificationArmoredKey)] : null;
    decryptedMessage = await DecryptMessageService.decrypt(message, privateKey, verificationKeys);
    pass = decryptedMessage === expectedMessage;
  } catch (error) {
    errorCause = error;
    pass = false;
  }

  const passMessage =
    `${matcherHint('.not.toDecryptedDataEqualTo')
    }\n\n` +
    `Expected decrypted message not to be equal to:\n` +
    `Decrypted message: ${decryptedMessage}\n` +
    `Control message: ${expectedMessage}`;

  let failMessage =
    `${matcherHint('.toDecryptedDataEqualTo')
    }\n\n` +
    `Expected decrypted message to be equal to:\n` +
    `Decrypted message: ${decryptedMessage}\n` +
    `Control message: ${expectedMessage}`;

  if (errorCause) {
    failMessage += `\n\n${errorCause.message}`;
  }

  return {pass: pass, message: () => (pass ? passMessage : failMessage)};
};
