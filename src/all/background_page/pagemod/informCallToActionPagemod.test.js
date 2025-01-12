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
 * @since         4.0.0
 */
import InformCallToAction from "./informCallToActionPagemod";
import {InformCallToActionEvents} from "../event/informCallToActionEvents";
import {v4 as uuid} from 'uuid';
import {enableFetchMocks} from "jest-fetch-mock";
import BuildApiClientOptionsService from "../service/account/buildApiClientOptionsService";
import GetActiveAccountService from "../service/account/getActiveAccountService";

jest.spyOn(InformCallToActionEvents, "listen").mockImplementation(jest.fn());

describe("InFormCallToAction", () => {
  beforeEach(async() => {
    jest.resetModules();
    jest.clearAllMocks();
    enableFetchMocks();
  });

  describe("InformCallToAction::attachEvents", () => {
    it("Should attach events", async() => {
      expect.assertions(4);
      // data mocked
      const port = {
        _port: {
          sender: {
            tab: {
              url: "https://localhost"
            }
          }
        }
      };
      // mock functions
      jest.spyOn(browser.cookies, "get").mockImplementation(() => ({value: "csrf-token"}));
      const mockedAccount = {user_id: uuid(), domain: "https://test.cipherguard.local"};
      const apiClientOptions = BuildApiClientOptionsService.buildFromAccount(mockedAccount);
      jest.spyOn(GetActiveAccountService, 'get').mockImplementation(() => mockedAccount);
      // process
      await InformCallToAction.attachEvents(port);
      // expectations
      expect(InformCallToActionEvents.listen).toHaveBeenCalledWith({port: port, tab: port._port.sender.tab, name: InformCallToAction.appName}, apiClientOptions, mockedAccount);
      expect(InformCallToAction.events).toStrictEqual([InformCallToActionEvents]);
      expect(InformCallToAction.mustReloadOnExtensionUpdate).toBeFalsy();
      expect(InformCallToAction.appName).toBe('InFormCallToAction');
    });
  });

  describe("InformCallToAction::canBeAttachedTo", () => {
    it("Should have the canBeAttachedTo not valid", async() => {
      expect.assertions(1);
      // process
      const canBeAttachedTo = await InformCallToAction.canBeAttachedTo({});
      // expectations
      expect(canBeAttachedTo).toBeFalsy();
    });
  });
});
