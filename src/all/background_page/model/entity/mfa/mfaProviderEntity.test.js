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
import MfaProviderEntity from "./mfaProviderEntity";
import {defaultMfaProviderData} from "./mfaProviderEntity.test.data";

describe("MfaProviderEntity", () => {
  it("schema must validate", () => {
    EntitySchema.validateSchema(MfaProviderEntity.ENTITY_NAME, MfaProviderEntity.getSchema());
  });

  it("constructor works if valid minimal DTO is provided", () => {
    const entity = new MfaProviderEntity(defaultMfaProviderData());

    expect(entity._props).toEqual(defaultMfaProviderData());
  });

  it("constructor returns validation error if provider field is missing", () => {
    try {
      new MfaProviderEntity({});
    } catch (error) {
      expect(error instanceof EntityValidationError).toBe(true);
      expect(error.hasError('provider', 'required')).toBe(true);
    }
  });
  it("constructor returns validation error if provider field is not part of the enum", () => {
    try {
      new MfaProviderEntity(defaultMfaProviderData({
        provider: "google"
      }));
    } catch (error) {
      expect(error instanceof EntityValidationError).toBe(true);
      expect(error.hasError('provider', 'enum')).toBe(true);
    }
  });
});
