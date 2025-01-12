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

import {enableFetchMocks} from "jest-fetch-mock";
import AccountEntity from "../../model/entity/account/accountEntity";
import BuildApiClientOptionsService from "../../service/account/buildApiClientOptionsService";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import CipherguardServiceUnavailableError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardServiceUnavailableError";
import PasswordPoliciesEntity from "../../model/entity/passwordPolicies/passwordPoliciesEntity";
import SavePasswordPoliciesController from "./savePasswordPoliciesController";
import {defaultPasswordPolicies} from "../../model/entity/passwordPolicies/passwordPoliciesEntity.test.data";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import {mockApiResponse} from "../../../../../test/mocks/mockApiResponse";

describe("SavePasswordPoliciesController::exec", () => {
  let account, apiClientOptions;

  beforeEach(async() => {
    enableFetchMocks();
    fetch.resetMocks();
    jest.spyOn(browser.cookies, "get").mockImplementationOnce(() => ({value: "csrf-token"}));

    account = new AccountEntity(defaultAccountDto());
    apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
  });

  it("Should save the given data", async() => {
    expect.assertions(3);

    const expectedPasswordPolicies = defaultPasswordPolicies({
      default_generator: "passphrase"
    });

    fetch.doMockOnceIf(/password-policies\/settings\.json/, async request => {
      const requestBody = JSON.parse(await request.text());
      expect(requestBody).toStrictEqual(expectedPasswordPolicies);
      return mockApiResponse(expectedPasswordPolicies);
    });

    const controller = new SavePasswordPoliciesController(null, null, account, apiClientOptions);
    const resultingPasswordPolicies = await controller.exec(expectedPasswordPolicies);

    const dto = resultingPasswordPolicies.toJSON();

    expect(resultingPasswordPolicies).toBeInstanceOf(PasswordPoliciesEntity);
    expect(dto).toStrictEqual(expectedPasswordPolicies);
  });

  it("Should throw an exception if the given data is not a valid password policies entity", async() => {
    expect.assertions(1);

    const wrongPasswordPolicies = defaultPasswordPolicies({
      default_generator: "wrong-data"
    });

    const controller = new SavePasswordPoliciesController(null, null, account, apiClientOptions);
    try {
      await controller.exec(wrongPasswordPolicies);
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
    }
  });

  it("Should throw an exception if something went wrong on the API", async() => {
    expect.assertions(1);

    fetch.doMockOnceIf(/password-policies\/settings\.json/, () => { throw new Error("something went wrong"); });

    const controller = new SavePasswordPoliciesController(null, null, account, apiClientOptions);
    try {
      await controller.exec(defaultPasswordPolicies());
    } catch (e) {
      expect(e).toBeInstanceOf(CipherguardServiceUnavailableError);
    }
  });
});
