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
import GroupUserTransferEntity from "./groupUserTransferEntity";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import * as assertEntityProperty from "cipherguard-styleguide/test/assert/assertEntityProperty";
import {defaultUserTransferDto} from "cipherguard-styleguide/src/shared/models/entity/group/groupTransfer.test.data";

describe("GroupUser transfer entity", () => {
  describe("::getSchema", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(GroupUserTransferEntity.constructor.name, GroupUserTransferEntity.getSchema());
    });
    it("validates id property", () => {
      assertEntityProperty.string(GroupUserTransferEntity, "id");
      assertEntityProperty.uuid(GroupUserTransferEntity, "id");
      assertEntityProperty.required(GroupUserTransferEntity, "id");
    });

    it("validates group_id property", () => {
      assertEntityProperty.string(GroupUserTransferEntity, "group_id");
      assertEntityProperty.uuid(GroupUserTransferEntity, "group_id");
      assertEntityProperty.required(GroupUserTransferEntity, "group_id");
    });
  });
  describe("::constructor", () => {
    it("works if valid minimal DTO is provided", () => {
      expect.assertions(1);

      const dto = defaultUserTransferDto();
      const userDeleteTransfer = new GroupUserTransferEntity(dto);

      expect(userDeleteTransfer.toDto()).toEqual(dto);
    });
  });
});
