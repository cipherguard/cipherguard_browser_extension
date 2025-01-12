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
 * @since         2.13.0
 */
import PermissionTransferEntity from "./permissionTransferEntity";
import EntityV2Collection from "cipherguard-styleguide/src/shared/models/entity/abstract/entityV2Collection";

class PermissionTransfersCollection extends EntityV2Collection {
  /**
   * @inheritDoc
   */
  get entityClass() {
    return PermissionTransferEntity;
  }

  /**
   * Get permissions entity schema
   *
   * @returns {Object} schema
   */
  static getSchema() {
    return {
      "type": "array",
      "items": PermissionTransferEntity.getSchema(),
      "minItems": 1
    };
  }
}

export default PermissionTransfersCollection;
