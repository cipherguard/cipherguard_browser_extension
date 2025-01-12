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

import each from "jest-each";
import ParseSetupUrlService from "./parseSetupUrlService";

describe("ParseSetupUrlService", () => {
  describe("ParseSetupUrlService:parse", () => {
    each([
      {scenario: "Legacy url", url: "https://cipherguard.dev/setup/install/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://cipherguard.dev"},
      {scenario: "TLD", url: "https://cipherguard.dev/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://cipherguard.dev"},
      {scenario: "TLD with Port", url: "https://cipherguard.dev:4443/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://cipherguard.dev:4443"},
      {scenario: "Non tld", url: "https://cipherguard/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://cipherguard"},
      {scenario: "IP v4", url: "https://127.0.0.1/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://127.0.0.1"},
      {scenario: "IP v4 with port", url: "https://127.0.0.1:4443/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://127.0.0.1:4443"},
      {scenario: "IP v6", url: "https://[0:0:0:0:0:0:0:1]/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://[0:0:0:0:0:0:0:1]"},
      {scenario: "IP v6 with port", url: "https://[0:0:0:0:0:0:0:1]:4443/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://[0:0:0:0:0:0:0:1]:4443"},
      {scenario: "Subdomain", url: "https://clould.cipherguard.dev/acme/setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://clould.cipherguard.dev/acme"},
      {scenario: "Trailing /", url: "https://clould.cipherguard.dev/acme//setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://clould.cipherguard.dev/acme"},
    ]).describe("should parse", _props => {
      it(`should parse: ${_props.scenario}`, () => {
        const parseResult = ParseSetupUrlService.parse(_props.url);

        expect.assertions(3);
        expect(parseResult.domain).toBe(_props.domain);
        expect(parseResult.user_id).toBe("571bec7e-6cce-451d-b53a-f8c93e147228");
        expect(parseResult.authentication_token_token).toBe("5ea0fc9c-b180-4873-8e00-9457862e43e0");
      });
    });

    each([
      {scenario: "No domain", url: "setup/install/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0"},
      {scenario: "No token", url: "https://cipherguard.dev/setup/install/571bec7e-6cce-451d-b53a-f8c93e147228"},
      {scenario: "No user id", url: "https://cipherguard.dev/setup/install"},
      {scenario: "Not targeting setup start", url: "https://cipherguard.dev/setup/recover/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0", domain: "https://cipherguard.dev"},
    ]).describe("should not parse", _props => {
      it(`should not parse: ${_props.scenario}`, () => {
        expect.assertions(1);
        expect(() => ParseSetupUrlService.parse(_props.url)).toThrowError("Cannot parse setup url. The url does not match the pattern.");
      });
    });

    it("should not parse if the domain does not validate", async() => {
      const url = "http://setup/start/571bec7e-6cce-451d-b53a-f8c93e147228/5ea0fc9c-b180-4873-8e00-9457862e43e0";

      expect.assertions(1);
      await expect(() => ParseSetupUrlService.parse(url)).toThrowError("Cannot parse setup url. The domain is not valid.");
    });
  });
});
