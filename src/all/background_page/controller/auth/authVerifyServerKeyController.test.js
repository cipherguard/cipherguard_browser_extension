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
 * @since         3.6.1
 */

import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import AuthVerifyServerKeyController from "./authVerifyServerKeyController";
import {Uuid} from "../../utils/uuid";
import ServerKeyChangedError from "../../error/serverKeyChangedError";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import {pgpKeys} from 'cipherguard-styleguide/test/fixture/pgpKeys/keys';
import {mockApiResponseError} from "../../../../../test/mocks/mockApiResponse";
import CipherguardApiFetchError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardApiFetchError";
import {enableFetchMocks} from "jest-fetch-mock";

jest.mock('../../model/gpgAuthToken', () => function() {
  return {token: "gpgauthv1.3.0|36|A89F6AB1-5BEE-32D8-a18B-461B810902E2|gpgauthv1.3.0", validate: () => true};
});

beforeEach(() => {
  enableFetchMocks();
  jest.resetModules();
  jest.clearAllMocks();
});

describe("AuthVerifyServerKeyController", () => {
  describe("::exec", () => {
    let account, controller;

    beforeEach(() => {
      account = new AccountEntity(defaultAccountDto());
      controller = new AuthVerifyServerKeyController(null, null, defaultApiClientOptions(), account);
    });

    it("Should verify the server successfully.", async() => {
      expect.assertions(1);

      jest.spyOn(controller.authVerifyServerChallengeService, "verifyAndValidateServerChallenge").mockImplementationOnce(jest.fn());

      const promise = controller.exec();
      await expect(promise).resolves.not.toThrow();
    });

    it("Should throw a server key has changed error", async() => {
      expect.assertions(1);

      account = new AccountEntity(defaultAccountDto({server_public_armored_key: pgpKeys.expired.public}));
      controller = new AuthVerifyServerKeyController(null, null, defaultApiClientOptions(), account);

      jest.spyOn(controller.authVerifyServerKeyService, "getServerKey").mockImplementationOnce(() => ({armored_key: pgpKeys.server.public}));

      const promise = controller.exec();
      await expect(promise).rejects.toThrowError(new ServerKeyChangedError("Could not verify the server key. The server key has changed."));
    });

    it("Should throw a server key expired error", async() => {
      expect.assertions(1);

      account = new AccountEntity(defaultAccountDto({server_public_armored_key: pgpKeys.expired.public}));
      controller = new AuthVerifyServerKeyController(null, null, defaultApiClientOptions(), account);

      jest.spyOn(controller.authVerifyServerKeyService, "getServerKey").mockImplementationOnce(() => ({armored_key: pgpKeys.expired.public}));

      const promise = controller.exec();
      await expect(promise).rejects.toThrowError(new ServerKeyChangedError("Could not verify the server key. The server key is expired."));
    });

    it("Should throw a server key changed error if the server key cannot be parsed.", async() => {
      expect.assertions(1);
      // Mock extension with a server public key that cannot be parsed.
      const publicKeys = [{
        "user_id": Uuid.get("https://cipherguard.local"),
        "armored_key": "-----BEGIN PGP PUBLIC KEY BLAOCK-----\n\n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\n=qZBo\n-----END PGP PUBLIC KEY BLOCK-----\n",
        "key_id": "ef1f7583",
        "user_ids": [
          {
            "name": "Cipherguard default user",
            "email": "cipherguard@yourdomain.com"
          }
        ],
        "fingerprint": "177C1516F9C1957ABC157CA592D946CDEF1F7583",
        "expires": "Infinity",
        "created": "2021-01-20T13:39:14.000Z",
        "algorithm": "rsa",
        "length": 2048,
        "curve": null,
        "private": false,
        "revoked": false
      }];
      // Mock account.
      const account = new AccountEntity(defaultAccountDto({server_public_armored_key: publicKeys[0].armored_key}));

      const controller = new AuthVerifyServerKeyController(null, null, defaultApiClientOptions(), account);

      const promise = controller.exec();
      await expect(promise).rejects.toThrowError(new ServerKeyChangedError("Could not verify the server key. The server key cannot be parsed."));
    });

    it("Should throw a server error if the server cannot be verified", async() => {
      expect.assertions(1);
      // Mock account.
      account = new AccountEntity(defaultAccountDto({server_public_armored_key: pgpKeys.server.public}));
      controller = new AuthVerifyServerKeyController(null, null, defaultApiClientOptions(), account);

      jest.spyOn(controller.authVerifyServerKeyService, "getServerKey").mockImplementationOnce(() =>  { throw Error('Unknown error'); });

      const promise = controller.exec();
      await expect(promise).rejects.toThrowError(new ServerKeyChangedError("Could not verify the server key. Server internal error. Check with your administrator."));
    });

    it("Should throw a the server message error in case of internal server error", async() => {
      expect.assertions(1);

      const expectedError = "Something wrong happened!";

      fetch.doMockOnceIf(/auth\/verify\.json\?api-version=v2/, async() => mockApiResponseError(500, expectedError));

      const promise = controller.exec();
      await expect(promise).rejects.toThrowError(expectedError);
    });

    it("Should throw a the message error in case of no content status", async() => {
      expect.assertions(1);
      const expectedError = "Cannot reach the server API";
      jest.spyOn(controller.authVerifyServerChallengeService.authVerifyServerKeyService.apiClient, "parseResponseJson").mockImplementation(async() => {
        throw new CipherguardApiFetchError(expectedError, {
          code: 0,
          body: {}
        });
      });

      const promise = controller.exec();
      await expect(promise).rejects.toThrowError(expectedError);
    });
  });
});
