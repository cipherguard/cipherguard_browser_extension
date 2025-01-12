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
import {PortEvents} from "../event/portEvents";
import AccountRecoveryBootstrap from "./accountRecoveryBootstrapPagemod";
import AccountLocalStorage from "../service/local_storage/accountLocalStorage";
import {initialAccountAccountRecoveryDto} from "../model/entity/account/accountAccountRecoveryEntity.test.data";

const spyAddWorker = jest.spyOn(WorkersSessionStorage, "addWorker");
jest.spyOn(ScriptExecution.prototype, "injectPortname").mockImplementation(jest.fn());
jest.spyOn(ScriptExecution.prototype, "injectCss").mockImplementation(jest.fn());
jest.spyOn(ScriptExecution.prototype, "injectJs").mockImplementation(jest.fn());
jest.spyOn(PortEvents, "listen").mockImplementation(jest.fn());

describe("AccountRecoveryBootstrap", () => {
  beforeEach(async() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("AccountRecoveryBootstrap::injectFile", () => {
    it("Should inject file", async() => {
      expect.assertions(9);
      // process
      await AccountRecoveryBootstrap.injectFiles(1, 0);
      // expectations
      expect(spyAddWorker).toHaveBeenCalledWith(expect.any(WorkerEntity));
      expect(spyAddWorker).toHaveBeenCalledTimes(1);
      expect(ScriptExecution.prototype.injectPortname).toHaveBeenCalledTimes(1);
      expect(ScriptExecution.prototype.injectCss).toHaveBeenCalledWith(AccountRecoveryBootstrap.contentStyleFiles);
      expect(ScriptExecution.prototype.injectJs).toHaveBeenCalledWith(AccountRecoveryBootstrap.contentScriptFiles);
      expect(AccountRecoveryBootstrap.contentScriptFiles).toStrictEqual(['contentScripts/js/dist/vendors.js', 'contentScripts/js/dist/account-recovery.js']);
      expect(AccountRecoveryBootstrap.events).toStrictEqual([PortEvents]);
      expect(AccountRecoveryBootstrap.mustReloadOnExtensionUpdate).toBeTruthy();
      expect(AccountRecoveryBootstrap.appName).toBe('AccountRecoveryBootstrap');
    });
  });

  describe("AccountRecoveryBootstrap::attachEvents", () => {
    it("Should attach events", async() => {
      expect.assertions(1);
      // data mocked
      const port = {
        on: () => jest.fn(),
        _port: {
          sender: {
            tab: {
              url: "https://cipherguard.dev/account-recovery/continue/d57c10f5-639d-5160-9c81-8a0c6c4ec856/cb66b7ca-bb85-4088-b0da-c50f6f0c2a13"
            }
          }
        }
      };
      // process
      await AccountRecoveryBootstrap.attachEvents(port);
      // expectations
      expect(PortEvents.listen).toHaveBeenCalledWith({port: port, tab: port._port.sender.tab, name: AccountRecoveryBootstrap.appName});
    });
  });

  describe("AccountRecoveryBootstrap::canBeAttachedTo", () => {
    it(`Should be able to attach a pagemod to browser frame`, async() => {
      expect.assertions(1);
      const account = initialAccountAccountRecoveryDto();
      jest.spyOn(AccountLocalStorage, "getAccountByUserIdAndType").mockImplementationOnce(() => account);
      const frameDetails = {
        frameId: Pagemod.TOP_FRAME_ID,
        url: `${account.domain}/account-recovery/continue/${account.user_id}/${account.authentication_token_token}`
      };
      const result = await AccountRecoveryBootstrap.canBeAttachedTo(frameDetails);
      expect(result).toBeTruthy();
    });

    it(`Should not be able to attach a pagemod to browser frame if account is not in the local storage`, async() => {
      expect.assertions(1);
      const frameDetails = {
        frameId: Pagemod.TOP_FRAME_ID,
        url: "https://cipherguard.dev/account-recovery/continue/d57c10f5-639d-5160-9c81-8a0c6c4ec856/cb66b7ca-bb85-4088-b0da-c50f6f0c2a13"
      };
      const result = await AccountRecoveryBootstrap.canBeAttachedTo(frameDetails);
      expect(result).toBeFalsy();
    });

    it(`Should not be able to attach a pagemod to browser frame if account domain does not match`, async() => {
      expect.assertions(1);
      const account = initialAccountAccountRecoveryDto();
      jest.spyOn(AccountLocalStorage, "getAccountByUserIdAndType").mockImplementationOnce(() => account);
      const frameDetails = {
        frameId: Pagemod.TOP_FRAME_ID,
        url: `https://cipherguard.dev/account-recovery/continue/${account.user_id}/${account.authentication_token_token}`
      };
      const result = await AccountRecoveryBootstrap.canBeAttachedTo(frameDetails);
      expect(result).toBeFalsy();
    });

    it(`Should not be able to attach a pagemod to browser frame if user id does not match`, async() => {
      expect.assertions(1);
      const account = initialAccountAccountRecoveryDto();
      jest.spyOn(AccountLocalStorage, "getAccountByUserIdAndType").mockImplementationOnce(() => account);
      const frameDetails = {
        frameId: Pagemod.TOP_FRAME_ID,
        url: `${account.domain}/account-recovery/continue/d57c10f5-639d-5160-9c81-8a0c6c4ec856/${account.authentication_token_token}`
      };
      const result = await AccountRecoveryBootstrap.canBeAttachedTo(frameDetails);
      expect(result).toBeFalsy();
    });

    it(`Should not be able to attach a pagemod to browser frame if token does not match`, async() => {
      expect.assertions(1);
      const account = initialAccountAccountRecoveryDto();
      jest.spyOn(AccountLocalStorage, "getAccountByUserIdAndType").mockImplementationOnce(() => account);
      const frameDetails = {
        frameId: Pagemod.TOP_FRAME_ID,
        url: `${account.domain}/account-recovery/continue/${account.user_id}/cb66b7ca-bb85-4088-b0da-c50f6f0c2a13`
      };
      const result = await AccountRecoveryBootstrap.canBeAttachedTo(frameDetails);
      expect(result).toBeFalsy();
    });

    each([
      {scenario: "No domain", url: "account-recovery/continue/d57c10f5-639d-5160-9c81-8a0c6c4ec856", frameId: Pagemod.TOP_FRAME_ID},
      {scenario: "No token", url: "https://cipherguard.dev/account-recovery/continue/d57c10f5-639d-5160-9c81-8a0c6c4ec856", frameId: Pagemod.TOP_FRAME_ID},
      {scenario: "Not top frame", url: "https://cipherguard.dev/account-recovery/continue/d57c10f5-639d-5160-9c81-8a0c6c4ec856/cb66b7ca-bb85-4088-b0da-c50f6f0c2a13", frameId: 1},
    ]).describe("Should not be able to attach a pagemod to browser frame", _props => {
      it(`Should be able to attach a pagemod to browser frame: ${_props.scenario}`, async() => {
        expect.assertions(1);
        const result = await AccountRecoveryBootstrap.canBeAttachedTo({frameId: _props.frameId, url: _props.url});
        expect(result).toBeFalsy();
      });
    });
  });
});
