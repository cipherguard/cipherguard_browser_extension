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
 * @since         3.9.0
 */
import {enableFetchMocks} from "jest-fetch-mock";
import {v4 as uuid} from "uuid";
import {mockApiResponse, mockApiResponseError} from "../../../../../test/mocks/mockApiResponse";
import SaveSsoSettingsAsDraftController from "./saveSsoSettingsAsDraftController";
import {withAzureSsoSettings} from "./saveSsoSettingsAsDraftController.test.data";
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import SsoSettingsEntity from "cipherguard-styleguide/src/shared/models/entity/ssoSettings/SsoSettingsEntity";
import CipherguardApiFetchError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardApiFetchError";

beforeEach(() => {
  enableFetchMocks();
});

describe("SaveSsoSettingsAsDraftController", () => {
  describe("SaveSsoSettingsAsDraftController::exec", () => {
    it("Should save the given settings as a draft.", async() => {
      expect.assertions(2);
      const ssoSettingsDto = withAzureSsoSettings();

      const expectedSavedSettings = Object.assign({}, ssoSettingsDto, {
        id: uuid(),
        created_by: uuid(),
        modified_by: uuid(),
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        data: Object.assign({}, ssoSettingsDto.data),
      });

      fetch.doMockOnceIf(new RegExp('/sso/settings.json'), async req => {
        const data = JSON.parse(await req.text());

        expect(data).toStrictEqual(ssoSettingsDto);
        return mockApiResponse(expectedSavedSettings);
      });

      const controller = new SaveSsoSettingsAsDraftController(null, null, defaultApiClientOptions());
      const settings = await controller.exec(ssoSettingsDto);

      expect(settings).toStrictEqual(new SsoSettingsEntity(expectedSavedSettings));
    });

    it("Should send an Error if the save can't happen.", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(new RegExp('/sso/settings.json'), () => mockApiResponseError(500, "Can't save the settings for some reason."));

      const controller = new SaveSsoSettingsAsDraftController(null, null, defaultApiClientOptions());
      try {
        await controller.exec(withAzureSsoSettings());
      } catch (e) {
        expect(e).toStrictEqual(new CipherguardApiFetchError(e.message));
      }
    });
  });
});
