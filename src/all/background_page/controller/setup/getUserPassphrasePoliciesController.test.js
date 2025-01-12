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

import GetUserPassphrasePoliciesController from "./getUserPassphrasePoliciesController";
import {defaultUserPassphrasePoliciesEntityDto} from "cipherguard-styleguide/src/shared/models/userPassphrasePolicies/UserPassphrasePoliciesDto.test.data";
import UserPassphrasePoliciesEntity from "cipherguard-styleguide/src/shared/models/entity/userPassphrasePolicies/userPassphrasePoliciesEntity";
import AccountTemporarySessionStorageService from "../../service/sessionStorage/accountTemporarySessionStorageService";

describe("GetUserPassphrasePoliciesController", () => {
  it("Should return the user passphrase policies from the runtime memory", async() => {
    const userPassphrasePolicies = new UserPassphrasePoliciesEntity(defaultUserPassphrasePoliciesEntityDto());
    jest.spyOn(AccountTemporarySessionStorageService, "get").mockImplementationOnce(() => ({userPassphrasePolicies: userPassphrasePolicies}));
    const controller = new GetUserPassphrasePoliciesController({port: {_port: {name: "test"}}}, null);

    expect.assertions(2);
    const accountRecoveryOrganizationPolicy = await controller.exec();
    expect(accountRecoveryOrganizationPolicy).toBeInstanceOf(UserPassphrasePoliciesEntity);
    expect(accountRecoveryOrganizationPolicy).toStrictEqual(userPassphrasePolicies);
  });

  it("Should return a default user passphrase policies if not defined on the runtime memory", async() => {
    jest.spyOn(AccountTemporarySessionStorageService, "get").mockImplementationOnce(() => null);
    const controller = new GetUserPassphrasePoliciesController({port: {_port: {name: "test"}}}, null);

    expect.assertions(1);
    const userPassphrasePolicies = await controller.exec();
    expect(userPassphrasePolicies).toStrictEqual(UserPassphrasePoliciesEntity.createFromDefault());
  });
});
