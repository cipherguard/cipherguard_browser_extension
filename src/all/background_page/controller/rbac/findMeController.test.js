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
 * @since         4.1.0
 */

import {mockApiResponse} from "../../../../../test/mocks/mockApiResponse";
import FindMeController from "./findMeController";
import {
  userSettingsRbacsCollectionData
} from "cipherguard-styleguide/src/shared/models/entity/rbac/rbacsCollection.test.data";
import rbacEntity from "cipherguard-styleguide/src/shared/models/entity/rbac/rbacEntity";
import RbacsCollection from "cipherguard-styleguide/src/shared/models/entity/rbac/rbacsCollection";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import {enableFetchMocks} from "jest-fetch-mock";
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";

beforeEach(() => {
  enableFetchMocks();
});

describe("FindMeController", () => {
  describe("FindMeController::exec", () => {
    it("Should retrieve the rbacs that apply to the user.", async() => {
      const account = new AccountEntity(defaultAccountDto());

      // Mock API fetch account recovery organization policy response.
      const mockApiResult = userSettingsRbacsCollectionData();
      fetch.doMock(() => mockApiResponse(mockApiResult));

      const controller = new FindMeController(null, null, defaultApiClientOptions(), account);
      const rbacsCollection = await controller.exec();

      expect.assertions(2);
      expect(rbacsCollection).toBeInstanceOf(RbacsCollection);
      const rbacsDto = rbacsCollection.toDto(rbacEntity.ALL_CONTAIN_OPTIONS);
      await expect(rbacsDto).toEqual(mockApiResult);
    });
  });
});
