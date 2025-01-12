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

class GroupUserTransferEntity extends EntityV2 {
  /**
   * Get managerTransfer entity schema
   *
   * @returns {Object} schema
   * @public
   */
  static getSchema() {
    return {
      "type": "object",
      "required": [
        "id", // Group user id
        "group_id", // Group ID
      ],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "group_id": {
          "type": "string",
          "format": "uuid"
        },
      }
    };
  }
}

export default GroupUserTransferEntity;
