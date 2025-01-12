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

import {v4 as uuidv4} from "uuid";
import {enableFetchMocks} from "jest-fetch-mock";
import {mockApiResponse} from '../../../../../../test/mocks/mockApiResponse';
import AccountEntity from "../../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../../model/entity/account/accountEntity.test.data";
import BuildApiClientOptionsService from "../../account/buildApiClientOptionsService";
import {mockApiResponseError} from "cipherguard-styleguide/test/mocks/mockApiResponse";
import CipherguardApiFetchError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardApiFetchError";
import CipherguardServiceUnavailableError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardServiceUnavailableError";
import SessionKeysBundlesApiService from "./sessionKeysBundlesApiService";
import {
  defaultSessionKeysBundlesDtos
} from "cipherguard-styleguide/src/shared/models/entity/sessionKey/sessionKeysBundlesCollection.test.data";
import {
  defaultSessionKeysBundleDto,
  minimalSessionKeysBundleDto
} from "cipherguard-styleguide/src/shared/models/entity/sessionKey/sessionKeysBundleEntity.test.data";
import SessionKeysBundleEntity from "cipherguard-styleguide/src/shared/models/entity/sessionKey/sessionKeysBundleEntity";

describe("SessionKeysBundlesApiService", () => {
  let apiClientOptions, account;
  beforeEach(async() => {
    enableFetchMocks();
    fetch.resetMocks();
    account = new AccountEntity(defaultAccountDto());
    apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
  });

  describe('::findAll', () => {
    it("retrieves the session keys bundle from the API", async() => {
      expect.assertions(2);

      const apiSessionKeysBundlesCollection = defaultSessionKeysBundlesDtos();
      fetch.doMockOnceIf(/metadata\/session-keys/, () => mockApiResponse(apiSessionKeysBundlesCollection));

      const service = new SessionKeysBundlesApiService(apiClientOptions);
      const resultDto = await service.findAll();

      expect(resultDto).toBeInstanceOf(Array);
      expect(resultDto).toHaveLength(apiSessionKeysBundlesCollection.length);
    });

    it("throws API error if the API encountered an issue", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/session-keys/, () => mockApiResponseError(500, "Something wrong happened!"));

      const service = new SessionKeysBundlesApiService(apiClientOptions);

      await expect(() => service.findAll()).rejects.toThrow(CipherguardApiFetchError);
    });

    it("throws service unavailable error if an error occurred but not from the API (by instance cloudflare)", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/session-keys/, () => { throw new Error("Service unavailable"); });

      const service = new SessionKeysBundlesApiService(apiClientOptions);

      await expect(() => service.findAll()).rejects.toThrow(CipherguardServiceUnavailableError);
    });
  });

  describe('::create', () => {
    it("create a session key bundle on the API.", async() => {
      expect.assertions(2);

      const sessionKeysBundleDto = minimalSessionKeysBundleDto();
      const sessionKeysBundle = new SessionKeysBundleEntity(sessionKeysBundleDto);
      fetch.doMockOnceIf(/metadata\/session-keys/, async req => {
        expect(req.method).toEqual("POST");
        const reqPayload = await req.json();
        return mockApiResponse(defaultSessionKeysBundleDto(reqPayload));
      });

      const service = new SessionKeysBundlesApiService(apiClientOptions);
      const resultDto = await service.create(sessionKeysBundle);

      expect(resultDto).toEqual(expect.objectContaining(sessionKeysBundleDto));
    });

    it("throws an invalid parameter error if the session key bundle parameter is not valid", async() => {
      expect.assertions(1);

      const service = new SessionKeysBundlesApiService(apiClientOptions);

      await expect(() => service.create(42)).rejects.toThrow(TypeError);
    });
  });

  describe('::delete', () => {
    it("delete a session key bundle on the API.", async() => {
      expect.assertions(1);

      const sessionKeysBundleId = uuidv4();
      fetch.doMockOnceIf(new RegExp(`/metadata\/session-keys\/${sessionKeysBundleId}\.json`), async req => {
        expect(req.method).toEqual("DELETE");
        return mockApiResponse({});
      });

      const service = new SessionKeysBundlesApiService(apiClientOptions);
      await service.delete(sessionKeysBundleId);
    });

    it("throws an invalid parameter error if the id parameter is not valid", async() => {
      expect.assertions(1);

      const service = new SessionKeysBundlesApiService(apiClientOptions);

      await expect(() => service.delete(42)).rejects.toThrow(Error);
    });
  });

  describe('::update', () => {
    it("update a session key bundle on the API.", async() => {
      expect.assertions(2);

      const sessionKeysBundleDto = defaultSessionKeysBundleDto();
      const sessionKeysBundle = new SessionKeysBundleEntity(sessionKeysBundleDto);
      fetch.doMockOnceIf(new RegExp(`/metadata\/session-keys\/${sessionKeysBundleDto.id}\.json`), async req => {
        expect(req.method).toEqual("PUT");
        const reqPayload = await req.json();
        return mockApiResponse(reqPayload);
      });

      const service = new SessionKeysBundlesApiService(apiClientOptions);
      const resultDto = await service.update(sessionKeysBundleDto.id, sessionKeysBundle);

      expect(resultDto).toEqual(expect.objectContaining(sessionKeysBundleDto));
    });

    it("throws an invalid parameter error if on of the parameters is not valid", async() => {
      expect.assertions(2);

      const service = new SessionKeysBundlesApiService(apiClientOptions);

      await expect(() => service.update(42)).rejects.toThrow(Error);
      await expect(() => service.update(uuidv4(), 42)).rejects.toThrow(Error);
    });
  });
});
