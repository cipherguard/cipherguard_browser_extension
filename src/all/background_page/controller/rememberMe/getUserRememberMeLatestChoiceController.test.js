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
 * @since         4.2.0
 */
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import UserRememberMeLatestChoiceEntity from "../../model/entity/rememberMe/userRememberMeLatestChoiceEntity";
import {defaultRememberMeLatestChoiceDto} from "../../model/entity/rememberMe/userRememberMeLatestChoiceEntity.test.data";
import UserRememberMeLatestChoiceLocalStorage from "../../service/local_storage/userRememberMeLatestChoiceLocalStorage";
import GetUserRememberMeLatestChoiceController from "./getUserRememberMeLatestChoiceController";

describe("GetUserRememberMeLatestChoiceController", () => {
  const account = new AccountEntity(defaultAccountDto());
  const storage = new UserRememberMeLatestChoiceLocalStorage(account);
  const controller = new GetUserRememberMeLatestChoiceController(null, null, account);

  it("Should return false if the local storage is not set", async() => {
    expect.assertions(1);
    storage.flush();

    const result = await controller.exec();
    expect(result).toStrictEqual(false);
  });

  it("Should return the value stored in local storage", async() => {
    expect.assertions(2);
    storage.flush();

    const entity1 = new UserRememberMeLatestChoiceEntity(defaultRememberMeLatestChoiceDto());
    storage.set(entity1);
    let result = await controller.exec();
    expect(result).toStrictEqual(false);

    const entity2 = new UserRememberMeLatestChoiceEntity(defaultRememberMeLatestChoiceDto({
      duration: -1
    }));
    storage.set(entity2);
    result = await controller.exec();
    expect(result).toStrictEqual(true);
  });
});
