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
 * @since         4.10.0
 */

import {enableFetchMocks} from "jest-fetch-mock";
import {mockApiResponse} from '../../../../../../test/mocks/mockApiResponse';
import AccountEntity from "../../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../../model/entity/account/accountEntity.test.data";
import BuildApiClientOptionsService from "../../account/buildApiClientOptionsService";
import {
  defaultMetadataKeysSettingsDto
} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeysSettingsEntity.test.data";
import MetadataKeysSettingsApiService from "./metadataKeysSettingsApiService";
import {mockApiResponseError} from "cipherguard-styleguide/test/mocks/mockApiResponse";
import CipherguardApiFetchError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardApiFetchError";
import CipherguardServiceUnavailableError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardServiceUnavailableError";

describe("MetadataKeysSettingsApiService", () => {
  let apiClientOptions;
  beforeEach(async() => {
    enableFetchMocks();
    fetch.resetMocks();
    const account = new AccountEntity(defaultAccountDto());
    apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
  });

  describe('::findSettings', () => {
    it("retrieves the settings from API", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys\/settings/, () => mockApiResponse(defaultMetadataKeysSettingsDto()));

      const service = new MetadataKeysSettingsApiService(apiClientOptions);
      const resultDto = await service.findSettings();

      const expectedDto = defaultMetadataKeysSettingsDto();
      expect(resultDto).toStrictEqual(expectedDto);
    });

    it("throws API error if the API encountered an issue", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys\/settings/, () => mockApiResponseError(500, "Something wrong happened!"));

      const service = new MetadataKeysSettingsApiService(apiClientOptions);

      await expect(() => service.findSettings()).rejects.toThrow(CipherguardApiFetchError);
    });

    it("throws service unavailable error if an error occurred but not from the API (by instance cloudflare)", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys\/settings/, () => { throw new Error("Service unavailable"); });

      const service = new MetadataKeysSettingsApiService(apiClientOptions);

      await expect(() => service.findSettings()).rejects.toThrow(CipherguardServiceUnavailableError);
    });
  });
});
