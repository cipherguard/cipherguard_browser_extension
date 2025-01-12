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
 * @since         4.8.0
 */
import AbstractAccountEntity from "./abstractAccountEntity";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import {defaultSecurityTokenDto} from "../../entity/securityToken/SecurityTokenEntity.test.data";
import {pgpKeys} from "cipherguard-styleguide/test/fixture/pgpKeys/keys";

/**
 * "Copy" of the AbstractAccountEntity class for testing purpose.
 * This class is made such that the constructor runs the EntitySchema validation
 * which is not the case for the "AbstractAccountEntity".
 * This way we can validate the "AbstractAccountEntity::getSchema" as we should.
 */
export class StubAbstractAccountEntity extends AbstractAccountEntity {
  constructor(accountDto, options = {}) {
    super(EntitySchema.validate(
      AbstractAccountEntity.ENTITY_NAME,
      accountDto,
      AbstractAccountEntity.getSchema()
    ), options);
  }
}

export const defaultAbstractAccountDto = (data = {}) => ({
  "type": "abstract-account",
  "domain": "https://cipherguard.local",
  "user_id": pgpKeys.ada.userId,
  "user_key_fingerprint": pgpKeys.account_recovery_request.fingerprint,
  "user_public_armored_key": pgpKeys.account_recovery_request.public,
  "server_public_armored_key": pgpKeys.server.public,
  "username": "ada@cipherguard.com",
  "first_name": "Ada",
  "last_name": "Lovelace",
  "locale": "en-UK",
  "security_token": defaultSecurityTokenDto(data?.security_token),
});
