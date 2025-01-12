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
 * @since         4.10.1
 */

import {enableFetchMocks} from "jest-fetch-mock";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import PassphraseStorageService from "../session_storage/passphraseStorageService";
import BuildApiClientOptionsService from "../account/buildApiClientOptionsService";
import FindSessionKeysService from "./findSessionKeysService";
import {mockApiResponseError} from "cipherguard-styleguide/test/mocks/mockApiResponse";
import CipherguardApiFetchError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardApiFetchError";
import CipherguardServiceUnavailableError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardServiceUnavailableError";
import {pgpKeys} from "cipherguard-styleguide/test/fixture/pgpKeys/keys";
import {
  defaultSessionKeysBundlesDtos
} from "cipherguard-styleguide/src/shared/models/entity/sessionKey/sessionKeysBundlesCollection.test.data";
import SessionKeysBundlesCollection
  from "cipherguard-styleguide/src/shared/models/entity/sessionKey/sessionKeysBundlesCollection";

describe("FindSessionKeysService", () => {
  let apiClientOptions, account;
  beforeEach(async() => {
    enableFetchMocks();
    fetch.resetMocks();
    account = new AccountEntity(defaultAccountDto());
    apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
  });

  describe('::findAllBundles', () => {
    it("retrieves the session keys bundles from API", async() => {
      expect.assertions(4);

      const spyOnPassphraseStorage = jest.spyOn(PassphraseStorageService, "get");
      spyOnPassphraseStorage.mockImplementation(() => pgpKeys.ada.passphrase);

      const apiSessionKeysBundlesCollection = defaultSessionKeysBundlesDtos();

      const service = new FindSessionKeysService(apiClientOptions, account);
      const spyOnFindService = jest.spyOn(service.sesionKeysBundlesApiService, "findAll");
      spyOnFindService.mockImplementation(() => apiSessionKeysBundlesCollection);
      const resultDto = await service.findAllBundles();

      expect(resultDto).toBeInstanceOf(SessionKeysBundlesCollection);
      expect(resultDto).toHaveLength(apiSessionKeysBundlesCollection.length);
      expect(resultDto.hasSomeDecryptedSessionKeysBundles()).toStrictEqual(true);
      expect(spyOnFindService).toHaveBeenCalledTimes(1);
    });

    it("throws an error if the keys from the API is already decrypted", async() => {
      expect.assertions(1);

      const spyOnPassphraseStorage = jest.spyOn(PassphraseStorageService, "get");
      spyOnPassphraseStorage.mockImplementation(() => pgpKeys.ada.passphrase);

      const apiSessionKeysBundlesCollection = defaultSessionKeysBundlesDtos({}, {withDecryptedSessionKeysBundle: true});

      const service = new FindSessionKeysService(apiClientOptions, account);
      const spyOnFindService = jest.spyOn(service.sesionKeysBundlesApiService, "findAll");
      spyOnFindService.mockImplementation(() => apiSessionKeysBundlesCollection);

      const expectedError = new Error("The session keys bundles should not be decrypted.");
      await expect(() => service.findAllBundles()).rejects.toThrow(expectedError);
    });

    it("throws API error if the API encountered an issue", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/session-keys/, () => mockApiResponseError(500, "Something wrong happened!"));

      const service = new FindSessionKeysService(apiClientOptions, account);

      await expect(() => service.findAllBundles()).rejects.toThrow(CipherguardApiFetchError);
    });

    it("throws service unavailable error if an error occurred but not from the API (by instance cloudflare)", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/session-keys/, () => { throw new Error("Service unavailable"); });

      const service = new FindSessionKeysService(apiClientOptions, account);

      await expect(() => service.findAllBundles()).rejects.toThrow(CipherguardServiceUnavailableError);
    });
  });
});
