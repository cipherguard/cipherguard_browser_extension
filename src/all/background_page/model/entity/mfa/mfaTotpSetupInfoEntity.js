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
 * @since         4.5.0
 */

import Entity from "cipherguard-styleguide/src/shared/models/entity/abstract/entity";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";


const ENTITY_NAME = 'MfaTotpSetupInfoEntity';

class MfaTotpSetupInfoEntity extends Entity {
  /**
   * @inheritDoc
   */
  constructor(dto, options = {}) {
    super(EntitySchema.validate(
      MfaTotpSetupInfoEntity.ENTITY_NAME,
      dto,
      MfaTotpSetupInfoEntity.getSchema()
    ), options);
  }

  /**
   * Get mfa policy entity schema
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "object",
      "required": [
        "otpProvisioningUri",
      ],
      "properties": {
        "otpProvisioningUri": {
          "type": "string",
          "pattern": /^otpauth:\/\/totp\/([^?]+)\?issuer=([^&]+)&secret=([A-Za-z0-9]+)$/
        }
      }
    };
  }

  /*
   * ==================================================
   * Static properties getters
   * ==================================================
   */
  /**
   * MfaTotpSetupInfoEntity.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }
}

export default MfaTotpSetupInfoEntity;

