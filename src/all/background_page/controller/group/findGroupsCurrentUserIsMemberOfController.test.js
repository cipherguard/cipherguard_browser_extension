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
 * @since         4.9.0
 */

import {enableFetchMocks} from "jest-fetch-mock";
import {defaultGroupsDtos} from "../../model/entity/group/groupsCollection.test.data";
import {mockApiResponse} from "../../../../../test/mocks/mockApiResponse";
import FindGroupsCurrentUserIsMemberOfController from "./findGroupsCurrentUserIsMemberOfController";
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import GroupsCollection from "../../model/entity/group/groupsCollection";
import MockExtension from "../../../../../test/mocks/mockExtension";
import {pgpKeys} from "cipherguard-styleguide/test/fixture/pgpKeys/keys";

beforeEach(() => {
  enableFetchMocks();
  jest.resetModules();
});

describe("FindGroupsCurrentUserIsMemberOfController", () => {
  describe("FindGroupsCurrentUserIsMemberOfController::exec", () => {
    it("Should return the groups the current user is member of", async() => {
      expect.assertions(2);
      const userInfo = pgpKeys.ada;
      await MockExtension.withConfiguredAccount(userInfo);

      const usersGroups = defaultGroupsDtos();

      fetch.doMockOnceIf(/groups.json/, async request => {
        const url = new URL(request.url);
        const hasUsers = url.searchParams.get("filter[has-users]");

        expect(hasUsers).toStrictEqual(userInfo.userId);
        return await mockApiResponse(usersGroups);
      });

      const apiClientOptions = defaultApiClientOptions();
      apiClientOptions.setResourceName('groups');
      const controller = new FindGroupsCurrentUserIsMemberOfController(null, null, apiClientOptions);
      const result = await controller.exec();

      expect(result).toStrictEqual(new GroupsCollection(usersGroups));
    });
  });
});
