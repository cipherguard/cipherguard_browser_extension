/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.12.0
 */

import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import OrganizationSettingsEntity from "./organizationSettingsEntity";
import {
  customEmailValidationProOrganizationSettings,
  defaultProOrganizationSettings
} from "./organizationSettingsEntity.test.data";
import * as assertEntityProperty from "cipherguard-styleguide/test/assert/assertEntityProperty";

describe("OrganizationSettingsEntity entity", () => {
  describe("OrganizationSettingsEntity::getSchema", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(OrganizationSettingsEntity.ENTITY_NAME, OrganizationSettingsEntity.getSchema());
    });

    it("validates status property", () => {
      const successValues = ['enabled', 'disabled', 'not found'];
      const failValues = ["string"];

      assertEntityProperty.enumeration(OrganizationSettingsEntity, "status", successValues, failValues);
      assertEntityProperty.notRequired(OrganizationSettingsEntity, "status");
    });

    it("validates app property", () => {
      const successScenarios = [assertEntityProperty.SCENARIO_OBJECT];
      /*
       * @todo: //add failing scenarios when nested object will be checked
       * const failingScenarios = [assertEntityProperty.SCENARIO_ARRAY, assertEntityProperty.SCENARIO_INTEGER, assertEntityProperty.SCENARIO_STRING];
       */
      const failingScenarios = [];

      assertEntityProperty.assert(OrganizationSettingsEntity, "app", successScenarios, failingScenarios, "type");
      assertEntityProperty.notRequired(OrganizationSettingsEntity, "app");
    });

    it("validates cipherguard property", () => {
      const successScenarios = [assertEntityProperty.SCENARIO_OBJECT];
      /*
       * @todo: //add failing scenarios when nested object will be checked
       * const failingScenarios = [assertEntityProperty.SCENARIO_ARRAY, assertEntityProperty.SCENARIO_INTEGER, assertEntityProperty.SCENARIO_STRING];
       */
      const failingScenarios = [];

      assertEntityProperty.assert(OrganizationSettingsEntity, "cipherguard", successScenarios, failingScenarios, "type");
      assertEntityProperty.notRequired(OrganizationSettingsEntity, "cipherguard");
    });

    it("validates serverTimeDiff property", () => {
      const successScenarios = [
        assertEntityProperty.SCENARIO_INTEGER,
        assertEntityProperty.SCENARIO_NULL,
      ];
      const failingScenarios = [
        assertEntityProperty.SCENARIO_STRING,
        assertEntityProperty.SCENARIO_FLOAT,
        assertEntityProperty.SCENARIO_OBJECT,
      ];

      assertEntityProperty.assert(OrganizationSettingsEntity, "serverTimeDiff", successScenarios, failingScenarios, "type");
      assertEntityProperty.notRequired(OrganizationSettingsEntity, "serverTimeDiff");
    });
  });

  describe("OrganizationSettingsEntity::constructor", () => {
    it("Should instantiate an OrganizationSettingsEntity with a minimal DTO", () => {
      expect.assertions(2);
      const dto = {};
      expect(() => new OrganizationSettingsEntity(dto)).not.toThrow();
      expect(new OrganizationSettingsEntity(dto).toDto()).toStrictEqual({
        status: 'enabled',
      });
    });

    it("Should instantiate an OrganizationSettingsEntity with full DTO", () => {
      expect.assertions(2);
      const dto = defaultProOrganizationSettings();
      expect(() => new OrganizationSettingsEntity(dto)).not.toThrow();
      expect(new OrganizationSettingsEntity(dto).toDto()).toStrictEqual(dto);
    });
  });

  describe("OrganizationSettingsEntity::sanitizeEmailValidateRegex", () => {
    it("should sanitize API regex and remove starting and trailing slash", () => {
      const organizationSettings = customEmailValidationProOrganizationSettings();
      OrganizationSettingsEntity.sanitizeEmailValidateRegex(organizationSettings);
      expect(organizationSettings.cipherguard.email.validate.regex).toEqual(".*@cipherguard.(c|com)$");
    });
  });

  describe("OrganizationSettingsEntity::emailValidateRegex", () => {
    it("should return null if undefined", () => {
      const organizationSettings = defaultProOrganizationSettings();
      const entity = new OrganizationSettingsEntity(organizationSettings);
      expect(entity.emailValidateRegex).toBeNull();
    });
    it("should return the customized setting if any", () => {
      const organizationSettings = customEmailValidationProOrganizationSettings();
      const entity = new OrganizationSettingsEntity(organizationSettings);
      expect(entity.emailValidateRegex).toEqual(".*@cipherguard.(c|com)$");
    });
  });
});
