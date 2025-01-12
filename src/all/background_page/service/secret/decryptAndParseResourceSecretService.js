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
 * @since         4.3.0
 */

import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";
import DecryptMessageService from "../crypto/decryptMessageService";
import PlaintextEntity from "../../model/entity/plaintext/plaintextEntity";

class DecryptAndParseResourceSecretService {
  /**
   * Decrypt a resource secret.
   * @param {SecretEntity} secret The secret entity.
   * @param {Object} schema The resource secret schema.
   * @param {openpgp.PrivateKey} decryptedPrivateKey the private key.
   * @returns {Promise<PlaintextEntity>}
   * @throws {Error} If the secret is not a valid secretEntity
   */
  static async decryptAndParse(secret, schema, decryptedPrivateKey) {
    const secretMessage = await OpenpgpAssertion.readMessageOrFail(secret.data);
    const decryptedSecretMessage = await DecryptMessageService.decrypt(secretMessage, decryptedPrivateKey);

    return this.parse(decryptedSecretMessage, schema);
  }

  /**
   * Parse the secret message as per its schema if any.
   *
   * @param {string} decryptedSecretMessage
   * @param {object} schema
   * @returns {Promise<string|PlaintextEntity>}
   * @throws {Error} if the secret message cannot be parsed.
   * @private
   */
  static async parse(decryptedSecretMessage, schema) {
    if (schema.type === 'string') {
      return PlaintextEntity.createFromLegacyPlaintextSecret(decryptedSecretMessage);
    }

    let secretDto;
    try {
      secretDto = JSON.parse(decryptedSecretMessage);
    } catch (error) {
      console.error(error);
      throw new Error('Unable to parse the secret.');
    }

    return new PlaintextEntity(secretDto, {schema});
  }
}

export default DecryptAndParseResourceSecretService;
