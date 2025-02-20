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
import AbstractActionLogEntity from "./abstractActionLogEntity";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";

const ENTITY_NAME = 'DefaultActionLog';

class DefaultActionLogEntity extends AbstractActionLogEntity {
  /**
   * @inheritDoc
   */
  constructor(actionLog, options = {}) {
    super(EntitySchema.validate(
      DefaultActionLogEntity.ENTITY_NAME,
      actionLog,
      DefaultActionLogEntity.getSchema()
    ), options);
  }

  /*
   * ==================================================
   * Static properties getters
   * ==================================================
   */

  /**
   * ActionLog.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }
}

export default DefaultActionLogEntity;
