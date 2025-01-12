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
import EntityV2Collection from "cipherguard-styleguide/src/shared/models/entity/abstract/entityV2Collection";
import GroupUserTransferEntity from "./groupUserTransferEntity";

class GroupUserTransfersCollection extends EntityV2Collection {
  /**
   * @inheritDoc
   */
  get entityClass() {
    return GroupUserTransferEntity;
  }
  /**
   * Get groupUsers entity schema
   *
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "array",
      "items": GroupUserTransferEntity.getSchema(),
      "minItems": 1
    };
  }
}

export default GroupUserTransfersCollection;
