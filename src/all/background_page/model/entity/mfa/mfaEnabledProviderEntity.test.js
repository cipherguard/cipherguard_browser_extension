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
 * @since         3.11.0
 */

import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import MfaEnabledProviderEntity from './mfaEnabledProviderEntity';
import {createMfaCombinedEnabledProviders} from './mfaCombinedEnabledProvidersEntity.data';

describe("MfaEnabledProvider entity", () => {
  it("schema must validate", () => {
    EntitySchema.validateSchema(MfaEnabledProviderEntity.ENTITY_NAME, MfaEnabledProviderEntity.getSchema());
  });

  it("constructor works if valid minimal DTO is provided", () => {
    const dto = createMfaCombinedEnabledProviders();
    const entity = new MfaEnabledProviderEntity(dto);

    expect(entity.yubikey).toEqual(dto.yubikey);
    expect(entity.totp).toEqual(dto.totp);
    expect(entity.duo).toEqual(dto.duo);
  });

  it("constructor returns validation error if dto required fields are missing", () => {
    try {
      new MfaEnabledProviderEntity({});
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error instanceof EntityValidationError).toBe(true);
      expect(error.hasError('yubikey', 'required')).toBe(true);
      expect(error.hasError('totp', 'required')).toBe(true);
      expect(error.hasError('duo', 'required')).toBe(true);
    }
  });
});
