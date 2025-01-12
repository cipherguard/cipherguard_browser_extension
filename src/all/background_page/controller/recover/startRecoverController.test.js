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
 * @since         3.6.0
 */

import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import StartRecoverController from "./startRecoverController";
import {enableFetchMocks} from "jest-fetch-mock";
import {mockApiResponse} from "../../../../../test/mocks/mockApiResponse";
import {defaultUserDto} from "cipherguard-styleguide/src/shared/models/entity/user/userEntity.test.data";
import {defaultVerifyDto} from "../../model/entity/auth/auth.test.data";
import GetGpgKeyInfoService from "../../service/crypto/getGpgKeyInfoService";
import UserEntity from "../../model/entity/user/userEntity";
import {initialAccountRecoverDto} from "../../model/entity/account/accountRecoverEntity.test.data";
import AccountRecoverEntity from "../../model/entity/account/accountRecoverEntity";
import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";
import WorkerService from "../../service/worker/workerService";
import UserPassphrasePoliciesEntity from "cipherguard-styleguide/src/shared/models/entity/userPassphrasePolicies/userPassphrasePoliciesEntity";
import {defaultUserPassphrasePoliciesEntityDto} from "cipherguard-styleguide/src/shared/models/userPassphrasePolicies/UserPassphrasePoliciesDto.test.data";
import {v4 as uuidv4} from "uuid";
import AccountTemporarySessionStorageService from "../../service/sessionStorage/accountTemporarySessionStorageService";

jest.mock("../../service/worker/workerService");

// Reset the modules before each test.
beforeEach(() => {
  enableFetchMocks();
});

describe("StartRecoverController", () => {
  describe("StartRecoverController::exec", () => {
    it("Should initiate the recover process and retrieve the recover material", async() => {
      const account = new AccountRecoverEntity(initialAccountRecoverDto());
      const workerId = uuidv4();
      const controller = new StartRecoverController({port: {_port: {name: workerId}}}, null, defaultApiClientOptions(), account);

      // Mock API fetch organization settings
      const mockVerifyDto = defaultVerifyDto();
      fetch.doMockOnce(() => mockApiResponse(mockVerifyDto));
      // Mock API fetch recover start.
      const mockRecoverStartDto = {user: defaultUserDto()};
      fetch.doMockOnce(() => mockApiResponse(mockRecoverStartDto));

      expect.assertions(5);
      await controller.exec();
      const expectedAccount = await AccountTemporarySessionStorageService.get(workerId);
      const key = await OpenpgpAssertion.readKeyOrFail(mockVerifyDto.keydata);
      expect(expectedAccount.account.serverPublicArmoredKey).toEqual((await GetGpgKeyInfoService.getKeyInfo(key)).armoredKey);
      expect(expectedAccount.account.username).toEqual(mockRecoverStartDto.user.username);
      expect(expectedAccount.account.firstName).toEqual(mockRecoverStartDto.user.profile.first_name);
      expect(expectedAccount.account.lastName).toEqual(mockRecoverStartDto.user.profile.last_name);
      expect(expectedAccount.account.user.toDto(UserEntity.ALL_CONTAIN_OPTIONS)).toEqual(mockRecoverStartDto.user);
    }, 10 * 1000);

    it("Should initiate the recover process and retrieve the recover material with all configuration", async() => {
      expect.assertions(6);
      const userPassphrasePoliciesDto = defaultUserPassphrasePoliciesEntityDto();
      const account = new AccountRecoverEntity(initialAccountRecoverDto());
      const workerId = uuidv4();
      const controller = new StartRecoverController({port: {_port: {name: workerId}}}, null, defaultApiClientOptions(), account);

      // Mock API fetch organization settings
      const mockVerifyDto = defaultVerifyDto();
      fetch.doMockOnce(() => mockApiResponse(mockVerifyDto));
      // Mock API fetch recover start.
      const mockRecoverStartDto = {
        user: defaultUserDto(),
        user_passphrase_policy: userPassphrasePoliciesDto
      };
      fetch.doMockOnce(() => mockApiResponse(mockRecoverStartDto));

      await controller.exec();
      const expectedAccount = await AccountTemporarySessionStorageService.get(workerId);
      const key = await OpenpgpAssertion.readKeyOrFail(mockVerifyDto.keydata);
      expect(expectedAccount.account.serverPublicArmoredKey).toEqual((await GetGpgKeyInfoService.getKeyInfo(key)).armoredKey);
      expect(expectedAccount.account.username).toEqual(mockRecoverStartDto.user.username);
      expect(expectedAccount.account.firstName).toEqual(mockRecoverStartDto.user.profile.first_name);
      expect(expectedAccount.account.lastName).toEqual(mockRecoverStartDto.user.profile.last_name);
      expect(expectedAccount.account.user.toDto(UserEntity.ALL_CONTAIN_OPTIONS)).toEqual(mockRecoverStartDto.user);
      expect(expectedAccount.userPassphrasePolicies).toStrictEqual(new UserPassphrasePoliciesEntity(userPassphrasePoliciesDto));
    }, 10 * 1000);

    it("Should not initiate the recover if the API does not provide a valid server public key", async() => {
      const workerId = uuidv4();
      const mockedWorker = {tab: {id: "tabID"}, port: {_port: {name: workerId}}};
      const account = new AccountRecoverEntity(initialAccountRecoverDto());
      const controller = new StartRecoverController(mockedWorker, null, defaultApiClientOptions(), account);

      // Mock API fetch verify
      const mockVerifyDto = defaultVerifyDto({keydata: "not a valid key"});
      fetch.doMockOnce(() => mockApiResponse(mockVerifyDto));
      // Mock Worker to assert error handler.
      const mockedBootstrapRecoverWorkerPortEmit = jest.fn();
      WorkerService.get = jest.fn(() => ({
        port: {
          emit: mockedBootstrapRecoverWorkerPortEmit
        }
      }));

      expect.assertions(2);
      const promise = controller.exec();
      await expect(promise).rejects.toThrowError("The key should be a valid openpgp armored key string.");
      expect(mockedBootstrapRecoverWorkerPortEmit).toHaveBeenCalledWith("cipherguard.recover-bootstrap.remove-iframe");
    });

    it("Should not initiate the recover if the API does not provide a valid user", async() => {
      const workerId = uuidv4();
      const mockedWorker = {tab: {id: "tabID"}, port: {_port: {name: workerId}}};
      const account = new AccountRecoverEntity(initialAccountRecoverDto());
      const controller = new StartRecoverController(mockedWorker, null, defaultApiClientOptions(), account);

      // Mock API fetch organization settings
      const mockVerifyDto = defaultVerifyDto();
      fetch.doMockOnce(() => mockApiResponse(mockVerifyDto));
      // Mock API fetch recover start.
      const mockRecoverStartDto = {user: null};
      fetch.doMockOnce(() => mockApiResponse(mockRecoverStartDto));
      // Mock Worker to assert error handler.
      const mockedBootstrapRecoverWorkerPortEmit = jest.fn();
      WorkerService.get = jest.fn(() => ({
        port: {
          emit: mockedBootstrapRecoverWorkerPortEmit
        }
      }));

      expect.assertions(2);
      const promise = controller.exec();
      await expect(promise).rejects.toThrowError("Could not validate property username.");
      expect(mockedBootstrapRecoverWorkerPortEmit).toHaveBeenCalledWith("cipherguard.recover-bootstrap.remove-iframe");
    });
  });
});
