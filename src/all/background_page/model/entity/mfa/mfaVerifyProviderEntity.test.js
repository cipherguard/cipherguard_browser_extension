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
 * @since         4.4.0
 */

import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import MfaVerifyProviderEntity from "./mfaVerifyProviderEntity";
import {defaultVerifyProviderData} from "./mfaVerifyProviderEntity.test.data";

describe("MfaVerifyProviderEntity", () => {
  it("schema must validate", () => {
    EntitySchema.validateSchema(MfaVerifyProviderEntity.ENTITY_NAME, MfaVerifyProviderEntity.getSchema());
  });

  it("constructor works if valid minimal DTO is provided", () => {
    const entity = new MfaVerifyProviderEntity(defaultVerifyProviderData());

    expect(entity._props).toEqual(defaultVerifyProviderData());
  });

  it("constructor returns validation error if verified field is missing", () => {
    try {
      new MfaVerifyProviderEntity({});
    } catch (error) {
      expect(error instanceof EntityValidationError).toBe(true);
      expect(error.hasError('verified', 'required')).toBe(true);
    }
  });
  it("constructor returns validation error if verified field is not a string", () => {
    try {
      new MfaVerifyProviderEntity(defaultVerifyProviderData({
        verified: 3
      }));
    } catch (error) {
      expect(error instanceof EntityValidationError).toBe(true);
      expect(error.hasError('verified', 'type')).toBe(true);
    }
  });
});
