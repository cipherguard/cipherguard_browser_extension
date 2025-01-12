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
 * @since         4.4.0
 */

import {enableFetchMocks} from "jest-fetch-mock";
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import MfaSetupVerifyTotpCodeController from "./MfaSetupVerifyTotpCodeController";
import {mockApiResponse} from "../../../../../test/mocks/mockApiResponse";
import {defaultSetupTotpData} from "../../model/entity/mfa/mfaSetupTotpEntity.test.data";
import MfaSetupTotpEntity from "../../model/entity/mfa/mfaSetupTotpEntity";

beforeEach(() => {
  enableFetchMocks();
});


describe("MfaSetupVerifyTotpCodeController", () => {
  let controller;

  beforeEach(() => {
    controller = new MfaSetupVerifyTotpCodeController(null, null, defaultApiClientOptions());
  });

  it("Should verify the otp code", async() => {
    expect.assertions(1);
    jest.spyOn(controller.multiFactorAuthenticationModel, "setupTotp");

    fetch.doMock(() => mockApiResponse({}));

    await controller.exec(defaultSetupTotpData());

    expect(controller.multiFactorAuthenticationModel.setupTotp).toHaveBeenCalledWith(new MfaSetupTotpEntity(defaultSetupTotpData()));
  });

  it("Should validate the otp uri and code with entity", async() => {
    expect.assertions(3);

    try {
      await controller.exec({});
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect(error.hasError('totp', 'required')).toBeTruthy();
      expect(error.hasError('otpProvisioningUri', 'required')).toBeTruthy();
    }
  });
});
