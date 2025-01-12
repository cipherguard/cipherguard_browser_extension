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
 * @since         3.6.0
 */
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import AccountRecoveryPrivateKeyEntity from "./accountRecoveryPrivateKeyEntity";
import {defaultAccountRecoveryPrivateKeyDto} from "cipherguard-styleguide/src/shared/models/entity/accountRecovery/accountRecoveryPrivateKeyEntity.test.data";

describe("AccountRecoveryPrivateKey entity", () => {
  it("schema must validate", () => {
    EntitySchema.validateSchema(AccountRecoveryPrivateKeyEntity.ENTITY_NAME, AccountRecoveryPrivateKeyEntity.getSchema());
  });

  it("constructor works if valid DTO is provided", () => {
    const dto = defaultAccountRecoveryPrivateKeyDto();
    const entity = new AccountRecoveryPrivateKeyEntity(dto);
    expect(entity.toDto(AccountRecoveryPrivateKeyEntity.ALL_CONTAIN_OPTIONS)).toEqual(dto);
  });

  it("constructor returns validation error if dto required fields are missing", () => {
    try {
      new AccountRecoveryPrivateKeyEntity({});
    } catch (error) {
      expect(error instanceof EntityValidationError).toBe(true);
      expect(error.details).toEqual({
        data: {required: 'The data is required.'},
      });
    }
  });
});

