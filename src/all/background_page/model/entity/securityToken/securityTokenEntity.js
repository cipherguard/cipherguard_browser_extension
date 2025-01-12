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
 */
import Entity from "cipherguard-styleguide/src/shared/models/entity/abstract/entity";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";

const ENTITY_NAME = "SecurityToken";

class SecurityTokenEntity extends Entity {
  /**
   * @inheritDoc
   */
  constructor(securityTokenDto, options = {}) {
    super(EntitySchema.validate(
      SecurityTokenEntity.ENTITY_NAME,
      securityTokenDto,
      SecurityTokenEntity.getSchema()
    ), options);
  }

  /**
   * Get entity schema
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "object",
      "required": [
        "code",
        "color",
        "textcolor"
      ],
      "properties": {
        "code": {
          "type": "string",
          "pattern": /^[a-zA-Z0-9-_]{3}$/
        },
        "color": {
          "type": "string",
          "format": "x-hex-color"
        },
        "textcolor": {
          "type": "string",
          "format": "x-hex-color"
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
   * Get code
   * @returns {string} ref ie. PB1
   */
  get code() {
    return this._props.code;
  }

  /**
   * Get color
   * @returns {string}
   */
  get color() {
    return this._props.color;
  }

  /**
   * Get text color
   * @returns {string}
   */
  get textcolor() {
    return this._props.textcolor;
  }

  /*
   * ==================================================
   * Static properties getters
   * ==================================================
   */

  /**
   * SecurityTokenEntity.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }
}

export default SecurityTokenEntity;
