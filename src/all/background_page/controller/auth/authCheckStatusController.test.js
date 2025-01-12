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
 * @since         4.7.0
 */

import MfaAuthenticationRequiredError from "../../error/mfaAuthenticationRequiredError";
import AuthenticationStatusService from "../../service/authenticationStatusService";
import AuthStatusLocalStorage from "../../service/local_storage/authStatusLocalStorage";
import AuthCheckStatusController from "./authCheckStatusController";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AuthCheckStatusController", () => {
  it("should return the auth status matching the unauthanticated state", async() => {
    expect.assertions(3);
    jest.spyOn(AuthStatusLocalStorage, "get").mockImplementation(() => undefined);
    jest.spyOn(AuthStatusLocalStorage, "flush");
    jest.spyOn(AuthenticationStatusService, "isAuthenticated").mockImplementation(() => false);

    const controller = new AuthCheckStatusController();
    const authStatus = await controller.exec(true);

    expect(AuthStatusLocalStorage.get).not.toHaveBeenCalled();
    expect(AuthStatusLocalStorage.flush).not.toHaveBeenCalled();
    expect(authStatus).toStrictEqual({
      isAuthenticated: false,
      isMfaRequired: false,
    });
  });

  it("expects the user to be fully authenticated", async() => {
    expect.assertions(3);
    jest.spyOn(AuthStatusLocalStorage, "get").mockImplementation(() => undefined);
    jest.spyOn(AuthStatusLocalStorage, "flush");
    jest.spyOn(AuthenticationStatusService, "isAuthenticated").mockImplementation(() => true);

    const controller = new AuthCheckStatusController();
    const authStatus = await controller.exec(true);

    expect(AuthStatusLocalStorage.get).not.toHaveBeenCalled();
    expect(AuthStatusLocalStorage.flush).not.toHaveBeenCalled();
    expect(authStatus).toStrictEqual({
      isAuthenticated: true,
      isMfaRequired: false,
    });
  });

  it("expects the user to require MFA authentication", async() => {
    expect.assertions(3);
    jest.spyOn(AuthStatusLocalStorage, "get").mockImplementation(() => undefined);
    jest.spyOn(AuthStatusLocalStorage, "flush");
    jest.spyOn(AuthenticationStatusService, "isAuthenticated").mockImplementation(() => { throw new MfaAuthenticationRequiredError(); });

    const controller = new AuthCheckStatusController();
    const authStatus = await controller.exec(true);

    expect(AuthStatusLocalStorage.get).not.toHaveBeenCalled();
    expect(AuthStatusLocalStorage.flush).not.toHaveBeenCalled();
    expect(authStatus).toStrictEqual({
      isAuthenticated: true,
      isMfaRequired: true,
    });
  });

  it("should return the auth status from the local storage", async() => {
    expect.assertions(4);
    const expectedAuthStatus = {
      isAuthenticated: false,
      isMfaRequired: false,
    };
    jest.spyOn(AuthStatusLocalStorage, "get").mockImplementation(() => expectedAuthStatus);
    jest.spyOn(AuthStatusLocalStorage, "flush");
    jest.spyOn(AuthenticationStatusService, "isAuthenticated");

    const controller = new AuthCheckStatusController();
    const authStatus = await controller.exec(false);

    expect(AuthStatusLocalStorage.get).toHaveBeenCalledTimes(1);
    expect(AuthStatusLocalStorage.flush).not.toHaveBeenCalled();
    expect(AuthenticationStatusService.isAuthenticated).not.toHaveBeenCalled();
    expect(authStatus).toStrictEqual(expectedAuthStatus);
  });
});
