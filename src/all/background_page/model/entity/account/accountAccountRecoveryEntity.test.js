/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.12.0
 */

import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import AccountAccountRecoveryEntity from "./accountAccountRecoveryEntity";
import {defaultAccountAccountRecoveryDto} from "./accountAccountRecoveryEntity.test.data";

describe("AccountAccountRecoveryEntity", () => {
  describe("AccountAccountRecoveryEntity:constructor", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(AccountAccountRecoveryEntity.ENTITY_NAME, AccountAccountRecoveryEntity.getSchema());
    });

    it("it should instantiate the entity with a minimal dto", () => {
      expect.assertions(2);
      const dto = defaultAccountAccountRecoveryDto();
      const entity = new AccountAccountRecoveryEntity(dto);
      expect(entity).toBeInstanceOf(AccountAccountRecoveryEntity);
      expect(entity.isUsernameValidated).toBeTruthy();
    });

    it("it should validate the username by default", () => {
      expect.assertions(2);
      const dto = defaultAccountAccountRecoveryDto({username: 'invalid-username'});
      try {
        new AccountAccountRecoveryEntity(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect(error.hasError('username', 'custom')).toBeTruthy();
      }
    });

    it("it should not validate the username if requested", () => {
      expect.assertions(2);
      const dto = defaultAccountAccountRecoveryDto({username: 'invalid-username'});
      const entity = new AccountAccountRecoveryEntity(dto, {validateUsername: false});
      expect(entity).toBeInstanceOf(AccountAccountRecoveryEntity);
      expect(entity.isUsernameValidated).toBeFalsy();
    });
  });

  describe("AccountAccountRecoveryEntity:toDto", () => {
    it("should return the expected properties.", () => {
      expect.assertions(2);
      const expectedKeys = [
        'type',
        'domain',
        'user_id',
        'user_key_fingerprint',
        'user_public_armored_key',
        'server_public_armored_key',
        'username',
        'first_name',
        'last_name'
      ];

      const dto = defaultAccountAccountRecoveryDto();
      const entity = new AccountAccountRecoveryEntity(dto);
      const resultDto = entity.toDto();
      const keys = Object.keys(resultDto);
      expect(Object.keys(resultDto).length).toBe(9);
      expect(keys).toEqual(expectedKeys);
    });

    it("it should return the user private key if requested", () => {
      expect.assertions(2);
      const expectedKeys = [
        'type',
        'domain',
        'user_id',
        'user_key_fingerprint',
        'user_public_armored_key',
        'server_public_armored_key',
        'username',
        'first_name',
        'last_name',
        'user_private_armored_key'
      ];

      const dto = defaultAccountAccountRecoveryDto();
      const entity = new AccountAccountRecoveryEntity(dto);
      const resultDto = entity.toDto({user_private_armored_key: true});
      const keys = Object.keys(resultDto);
      expect(Object.keys(resultDto).length).toBe(10);
      expect(keys).toEqual(expectedKeys);
    });

    it("it should return the user security token if requested", () => {
      expect.assertions(2);
      const expectedKeys = [
        'type',
        'domain',
        'user_id',
        'user_key_fingerprint',
        'user_public_armored_key',
        'server_public_armored_key',
        'username',
        'first_name',
        'last_name',
        'security_token'
      ];

      const dto = defaultAccountAccountRecoveryDto();
      const entity = new AccountAccountRecoveryEntity(dto);
      const resultDto = entity.toDto({security_token: true});
      const keys = Object.keys(resultDto);
      expect(Object.keys(resultDto).length).toBe(10);
      expect(keys).toEqual(expectedKeys);
    });
  });
});
