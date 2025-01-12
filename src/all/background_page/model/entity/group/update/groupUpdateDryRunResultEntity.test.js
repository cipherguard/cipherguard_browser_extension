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
import GroupUpdateDryRunResultEntity from "./groupUpdateDryRunResultEntity";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import * as assertEntityProperty from "cipherguard-styleguide/test/assert/assertEntityProperty";
import {defaultNeededSecretDto} from "cipherguard-styleguide/src/shared/models/entity/secret/neededSecretEntity.test.data";
import {minimalDto} from "cipherguard-styleguide/src/shared/models/entity/secret/secretEntity.test.data";


describe("Group update dry run result entity", () => {
  describe("::getSchema", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(GroupUpdateDryRunResultEntity.constructor.name, GroupUpdateDryRunResultEntity.getSchema());
    });
    it("validates secrets property", () => {
      assertEntityProperty.array(GroupUpdateDryRunResultEntity, "secrets");
    });
    it("validates needed_secrets property", () => {
      assertEntityProperty.array(GroupUpdateDryRunResultEntity, "needed_secrets");
    });
  });

  describe("::constructor", () => {
    it("constructor works if valid minimal DTO is provided (only owners)", () => {
      expect.assertions(1);

      const dto = {};
      const groupUpdateDryRunResultEntity = new GroupUpdateDryRunResultEntity(dto);

      expect(groupUpdateDryRunResultEntity.toDto()).toEqual(dto);
    });

    it("constructor works if valid DTO is provided", () => {
      expect.assertions(5);

      const dto = {needed_secrets: [defaultNeededSecretDto()], secrets: [minimalDto()]};
      const groupUpdateDryRunResultEntity = new GroupUpdateDryRunResultEntity(dto);

      expect(groupUpdateDryRunResultEntity.toDto()).toEqual(dto);
      expect(groupUpdateDryRunResultEntity.secrets).toBeDefined();
      expect(groupUpdateDryRunResultEntity.secrets.length).toBe(1);
      expect(groupUpdateDryRunResultEntity.neededSecrets).toBeDefined();
      expect(groupUpdateDryRunResultEntity.neededSecrets.length).toBe(1);
    });
  });
});
