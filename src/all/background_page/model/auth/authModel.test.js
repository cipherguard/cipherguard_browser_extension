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
 * @since         4.1.0
 */
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import AuthModel from "../../model/auth/authModel";
import AuthLogoutService from "cipherguard-styleguide/src/shared/services/api/auth/AuthLogoutService";
import PostLogoutService from "../../service/auth/postLogoutService";

beforeEach(async() => {
  jest.clearAllMocks();
});

describe("AuthModel", () => {
  describe("AuthModel::logout", () => {
    it("Should call the AuthLogoutService to logout and dispatch a logout event", async() => {
      expect.assertions(2);
      const apiClientOptions = defaultApiClientOptions();
      const model = new AuthModel(apiClientOptions);

      const logoutServiceSpy = jest.spyOn(AuthLogoutService.prototype, "logout").mockImplementation(() => {});
      const postLogoutSpy = jest.spyOn(PostLogoutService, "exec");

      await model.logout();

      expect(logoutServiceSpy).toHaveBeenCalledTimes(1);
      expect(postLogoutSpy).toHaveBeenCalledTimes(1);
    });
  });
});
