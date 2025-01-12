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

const ENTITY_NAME = 'PasswordExpiryResource';

class PasswordExpiryResourceEntity extends Entity {
  /**
   * @inheritDoc
   */
  constructor(passwordExpiryResourceDto, options = {}) {
    super(EntitySchema.validate(
      PasswordExpiryResourceEntity.ENTITY_NAME,
      passwordExpiryResourceDto,
      PasswordExpiryResourceEntity.getSchema()
    ), options);
  }

  /**
   * Get passwordExpiryResource entity schema
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "object",
      "required": [
        "id",
        "expired"
      ],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "expired": {
          "type": "string",
          "format": "date-time",
          "nullable": true,
        },
        "created": {
          "type": "string",
          "format": "date-time"
        },
        "modified": {
          "type": "string",
          "format": "date-time"
        },
        "created_by": {
          "type": "string",
          "format": "uuid"
        },
        "modified_by": {
          "type": "string",
          "format": "uuid"
        }
      }
    };
  }

  /*
   * ==================================================
   * Dynamic properties getters
   * ==================================================
   */
  /**
   * Get resource id
   * @returns {string} uuid
   */
  get id() {
    return this._props.id;
  }

  /**
   * Get expired date
   * @returns {string|null} string
   */
  get expired() {
    return this._props.expired;
  }

  /*
   * ==================================================
   * Static properties getters
   * ==================================================
   */
  /**
   * PasswordExpiryResourceEntity.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }
}

export default PasswordExpiryResourceEntity;
