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
 * @since         3.8.0
 */
import WorkersSessionStorage from "../service/sessionStorage/workersSessionStorage";
import WorkerEntity from "../model/entity/worker/workerEntity";
import ScriptExecution from "../sdk/scriptExecution";
import each from "jest-each";
import Pagemod from "./pagemod";
import {PublicWebsiteSignInEvents} from "../event/publicWebsiteSignInEvents";
import PublicWebsiteSignIn from "./publicWebsiteSignInPagemod";
import {v4 as uuid} from 'uuid';
import GetActiveAccountService from "../service/account/getActiveAccountService";

const spyAddWorker = jest.spyOn(WorkersSessionStorage, "addWorker");
jest.spyOn(ScriptExecution.prototype, "injectPortname").mockImplementation(jest.fn());
jest.spyOn(ScriptExecution.prototype, "injectCss").mockImplementation(jest.fn());
jest.spyOn(ScriptExecution.prototype, "injectJs").mockImplementation(jest.fn());
jest.spyOn(PublicWebsiteSignInEvents, "listen").mockImplementation(jest.fn());

describe("PublicWebsiteSign", () => {
  beforeEach(async() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("PublicWebsiteSignIn::injectFile", () => {
    it("Should inject file", async() => {
      expect.assertions(10);
      // process
      await PublicWebsiteSignIn.injectFiles(1, 0);
      // expectations
      expect(spyAddWorker).toHaveBeenCalledWith(expect.any(WorkerEntity));
      expect(spyAddWorker).toHaveBeenCalledTimes(1);
      expect(ScriptExecution.prototype.injectPortname).toHaveBeenCalledTimes(1);
      expect(ScriptExecution.prototype.injectCss).toHaveBeenCalledWith(PublicWebsiteSignIn.contentStyleFiles);
      expect(ScriptExecution.prototype.injectJs).toHaveBeenCalledWith(PublicWebsiteSignIn.contentScriptFiles);
      expect(PublicWebsiteSignIn.contentStyleFiles).toStrictEqual([]);
      expect(PublicWebsiteSignIn.contentScriptFiles).toStrictEqual(['contentScripts/js/dist/public-website-sign-in/vendors.js', 'contentScripts/js/dist/public-website-sign-in/public-website-sign-in.js']);
      expect(PublicWebsiteSignIn.events).toStrictEqual([PublicWebsiteSignInEvents]);
      expect(PublicWebsiteSignIn.mustReloadOnExtensionUpdate).toBeFalsy();
      expect(PublicWebsiteSignIn.appName).toBe('PublicWebsiteSignIn');
    });
  });

  describe("PublicWebsiteSign::canBeAttachedTo", () => {
    it("Should be able to attach auth bootstrap pagemod to browser frame", async() => {
      expect.assertions(1);
      // mock functions
      jest.spyOn(GetActiveAccountService, "get").mockImplementation(() => {});
      const result = await PublicWebsiteSignIn.canBeAttachedTo({frameId: Pagemod.TOP_FRAME_ID, url: "https://www.cipherguard.com"});
      expect(result).toBeTruthy();
    });

    each([
      {scenario: "No domain", url: "https://passolt.dev", frameId: Pagemod.TOP_FRAME_ID},
      {scenario: "Not top frame", url: "https://www.cipherguard.com", frameId: 1},
    ]).describe("Should not be able to attach a pagemod to browser frame", _props => {
      it(`Should be able to attach a pagemod to browser frame: ${_props.scenario}`, async() => {
        expect.assertions(1);
        const result = await PublicWebsiteSignIn.canBeAttachedTo({frameId: _props.frameId, url: _props.url});
        expect(result).toBeFalsy();
      });
    });

    it("Should have the constraint not valid if the user is not valid", async() => {
      expect.assertions(1);
      // mock functions
      jest.spyOn(GetActiveAccountService, "get").mockImplementation(() => { throw new Error(); });
      // process
      const result = await PublicWebsiteSignIn.canBeAttachedTo({frameId: 0, url: "https://www.cipherguard.com"});
      // expectations
      expect(result).toBeFalsy();
    });
  });

  describe("PublicWebsiteSignIn::attachEvents", () => {
    it("Should attach events", async() => {
      expect.assertions(2);
      // data mocked
      const port = {
        on: () => jest.fn(),
        _port: {
          sender: {
            tab: {
              url: "https://www.cipherguard.com"
            }
          }
        }
      };

      const mockedAccount = {user_id: uuid()};
      jest.spyOn(GetActiveAccountService, 'get').mockImplementation(() => mockedAccount);
      // process
      await PublicWebsiteSignIn.attachEvents(port);
      // expectations
      expect(GetActiveAccountService.get).toHaveBeenCalled();
      expect(PublicWebsiteSignInEvents.listen).toHaveBeenCalledWith({port: port, tab: port._port.sender.tab}, null, mockedAccount);
    });
  });
});
