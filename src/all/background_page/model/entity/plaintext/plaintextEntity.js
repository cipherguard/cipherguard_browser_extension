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
 * @since         3.0.0
 */
import EntityV2 from "cipherguard-styleguide/src/shared/models/entity/abstract/entityV2";
import {RESOURCE_TYPE_PASSWORD_STRING_LEGACY_DEFINITION_SCHEMA} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypeSchemasDefinition";


/**
 * This is a schema specificaly made up for 'password-string' resource type plaintext secret data validation.
 * Currently our validation system cannot take the RESOURCE_TYPE_PASSWORD_STRING_LEGACY_DEFINITION_SCHEMA structure as-is.
 * So, this, is a wrapper schema that put the legacy schema into a compatible schema structure.
 * It's not meant to be used elsewhere than here.
 * @type {object}
 * @private
 */
export const PLAINTEXT_SECRET_SCHEMA_PASSWORD_STRING = {
  type: "object",
  required: ["password"],
  properties: {
    password: RESOURCE_TYPE_PASSWORD_STRING_LEGACY_DEFINITION_SCHEMA.secret,
  },
};

class PlaintextEntity extends EntityV2 {
  /**
   * Create plaintext secret entity from legacy plaintext secret.
   * @param {string} password The password
   * @returns {PlaintextEntity}
   */
  static createFromLegacyPlaintextSecret(password) {
    const plaintextSecretDto = {password};
    return new PlaintextEntity(plaintextSecretDto, {schema: PLAINTEXT_SECRET_SCHEMA_PASSWORD_STRING});
  }

  /**
   * Get plaintext entity schema
   * @throws TypeError unsupported
   */
  static getSchema() {
    throw new TypeError('Plaintext only support dynamic schemas, defined from resource type.');
  }

  /**
   * Return password prop if any
   *
   * @returns {string|null} password
   */
  get password() {
    return this._props.password || null;
  }

  /**
   * Return description prop if any
   *
   * @returns {string|null} description
   */
  get description() {
    return this._props.description || null;
  }

  /**
   * Return totp prop if any
   *
   * @returns {object|null} totp
   */
  get totp() {
    return this._props.totp || null;
  }
}

export default PlaintextEntity;
