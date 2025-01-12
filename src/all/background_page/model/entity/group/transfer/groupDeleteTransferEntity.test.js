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
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import GroupDeleteTransferEntity from "./groupDeleteTransferEntity";
import * as assertEntityProperty from "cipherguard-styleguide/test/assert/assertEntityProperty";
import {defaultGroupTransferDto} from "cipherguard-styleguide/src/shared/models/entity/group/groupTransfer.test.data";

describe("Group delete transfer entity", () => {
  describe("::getSchema", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(GroupDeleteTransferEntity.constructor.name, GroupDeleteTransferEntity.getSchema());
    });
    it("validates owners property", () => {
      assertEntityProperty.array(GroupDeleteTransferEntity, "owners");
      assertEntityProperty.required(GroupDeleteTransferEntity, "owners");
    });
  });
  describe("::constructor", () => {
    it("works if valid minimal DTO is provided", () => {
      expect.assertions(4);

      const dto = defaultGroupTransferDto();
      const groupDeleteTransfer = new GroupDeleteTransferEntity(dto);

      expect(groupDeleteTransfer.toDto()).toEqual(dto);
      expect(groupDeleteTransfer._owners).toBeDefined();
      expect(groupDeleteTransfer._owners.length).toBe(1);
      expect(JSON.stringify(groupDeleteTransfer._owners)).toEqual(JSON.stringify(dto.owners));
    });
  });
});
