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
 * @since         4.3.0
 */

import DesktopTransferModel from "./desktopTransferModel";
import GetLegacyAccountService from "../../service/account/getLegacyAccountService";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import {expectedKeys} from "../entity/account/accountKitEntity.test.data";

describe("DesktopTransferModel", () => {
  const account = new AccountEntity(defaultAccountDto());
  const model = new DesktopTransferModel();

  beforeEach(() => {
    jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => new AccountEntity(account));
  });

  describe("ExportDesktopAccountController::exec", () => {
    it("Should export account kit with user private key and security token.", async() => {
      expect.assertions(11);

      const accountKit = (await model.getAccountKit(account)).toDto();
      const keys = Object.keys(accountKit);

      expect(keys.length).toEqual(9);
      expect(keys).toEqual(expectedKeys);
      expect(accountKit.domain).toEqual(account.domain);
      expect(accountKit.first_name).toEqual(account.firstName);
      expect(accountKit.last_name).toEqual(account.lastName);
      expect(accountKit.server_public_armored_key).toEqual(account.serverPublicArmoredKey);
      expect(accountKit.user_id).toEqual(account.userId);
      expect(accountKit.user_public_armored_key).toEqual(account.userPublicArmoredKey);
      expect(accountKit.user_private_armored_key).toEqual(account.userPrivateArmoredKey);
      expect(accountKit.username).toEqual(account.username);
      expect(accountKit.security_token).toEqual(account.securityToken.toDto());
    });
  });
});

