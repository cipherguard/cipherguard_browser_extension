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
 * @since         3.3.0
 */

import toolbarService from "./toolbarService";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import GetLegacyAccountService from "../account/getLegacyAccountService";
import {BrowserExtensionIconService} from "../ui/browserExtensionIcon.service";
import {defaultResourceDtosCollection} from "cipherguard-styleguide/src/shared/models/entity/resource/resourcesCollection.test.data";
import ResourceLocalStorage from "../local_storage/resourceLocalStorage";
import {
  resourceTypesCollectionDto
} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection.test.data";
import ResourceTypeLocalStorage from "../local_storage/resourceTypeLocalStorage";
import CheckAuthStatusService from "../auth/checkAuthStatusService";

jest.useFakeTimers();

// Reset the modules before each test.
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe("ToolbarService", () => {
  const browserExtensionIconServiceActivateMock = jest.fn();
  const browserExtensionIconServiceDeactivateMock = jest.fn();
  const browserExtensionIconServiceSetCountMock = jest.fn();

  beforeEach(() => {
    toolbarService.tabUrl = null;
    jest.spyOn(BrowserExtensionIconService, "activate").mockImplementation(browserExtensionIconServiceActivateMock);
    jest.spyOn(BrowserExtensionIconService, "deactivate").mockImplementation(browserExtensionIconServiceDeactivateMock);
    jest.spyOn(BrowserExtensionIconService, "setSuggestedResourcesCount").mockImplementation(browserExtensionIconServiceSetCountMock);
  });

  describe("handleUserLoggedIn", () => {
    it("Given the user is on a tab which has no suggested resource for, it should activate the cipherguard icon and display no suggested resource.", async() => {
      expect.assertions(2);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementation(() => [{url: 'https://www.wherever.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();

      expect(browserExtensionIconServiceActivateMock).toHaveBeenCalled();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenCalledWith(0);
    });

    it("Given the user is on a tab which has suggested resource for, it should activate the cipherguard icon and display the number of suggested resources.", async() => {
      expect.assertions(2);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementation(() => [{url: 'https://www.cipherguard.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();

      expect(browserExtensionIconServiceActivateMock).toHaveBeenCalled();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenCalledWith(4);
    });
  });

  describe("handleUserLoggedOut", () => {
    it("Given the user signs out, it should deactivate the cipherguard icon.", async() => {
      expect.assertions(1);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementation(() => [{url: 'https://www.wherever.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();
      await toolbarService.handleUserLoggedOut();

      expect(browserExtensionIconServiceDeactivateMock).toHaveBeenCalled();
    });
  });

  describe("handleSuggestedResourcesOnUpdatedTab", () => {
    it("Given the user navigates to a url having suggested resources, it should change the cipherguard icon suggested resources count.", async() => {
      expect.assertions(1);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.wherever.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();

      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.cipherguard.com'}]);
      await toolbarService.handleSuggestedResourcesOnUpdatedTab(null, {url: "https://www.cipherguard.com"});

      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(4);
    });
  });

  describe("handleSuggestedResourcesOnActivatedTab", () => {
    it("Given the user activates a tab having suggested resources, it should change the cipherguard icon suggested resources count.", async() => {
      expect.assertions(2);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.wherever.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(0);
      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.cipherguard.com'}]);
      await toolbarService.handleSuggestedResourcesOnActivatedTab();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(4);
    });
  });

  describe("handleSuggestedResourcesOnFocusedWindow", () => {
    it("Given the user switches to a window with a tab having suggested resources, it should change the cipherguard icon suggested resources count.", async() => {
      expect.assertions(2);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.wherever.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(0);
      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.cipherguard.com'}]);
      await toolbarService.handleSuggestedResourcesOnFocusedWindow(42);
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(4);
    });

    it("Given the user switches to another application, it should reset the cipherguard icon suggested resources count.", async() => {
      expect.assertions(2);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      jest.spyOn(browser.tabs, "query").mockImplementationOnce(() => [{url: 'https://www.cipherguard.com'}]);
      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(ResourceLocalStorage, "get").mockImplementation(() => defaultResourceDtosCollection());
      jest.spyOn(ResourceTypeLocalStorage, "get").mockImplementation(() => resourceTypesCollectionDto());
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: true}));

      await toolbarService.handleUserLoggedIn();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(4);
      await toolbarService.handleSuggestedResourcesOnFocusedWindow(browser.windows.WINDOW_ID_NONE);
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenLastCalledWith(0);
    });

    it("Given the user switches to another application, it should not change the cipherguard icon if user is not authenticated.", async() => {
      expect.assertions(1);
      const account = new AccountEntity(defaultAccountDto());

      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => account);
      jest.spyOn(CheckAuthStatusService.prototype, "checkAuthStatus").mockImplementation(() => ({isAuthenticated: false}));

      await toolbarService.handleSuggestedResourcesOnFocusedWindow(42);
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenCalledTimes(0);
    });

    it("Given an anonymous user switches to another application, it should not change the cipherguard icon.", async() => {
      expect.assertions(1);

      jest.spyOn(GetLegacyAccountService, "get").mockImplementation(() => { throw Error("The user is not set"); });

      await toolbarService.handleSuggestedResourcesOnActivatedTab();
      expect(browserExtensionIconServiceSetCountMock).toHaveBeenCalledTimes(0);
    });
  });
});
