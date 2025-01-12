/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.10.0
 */

import each from "jest-each";
import ParseWebIntegrationUrlService from "./parseWebIntegrationUrlService";
import {Config} from "../../model/config";

describe("ParseWebIntegrationUrlService", () => {
  const domain = "https://cipherguard.dev";

  beforeEach(() => {
    Config.write("user.settings.trustedDomain", domain);
  });

  describe("ParseWebIntegrationUrlService:test", () => {
    each([
      {scenario: "Web page", url: "https://test.com/auth/login"},
      {scenario: "Web page with parameters", url: "https://test.com/auth/login?locale=en-UK"},
      {scenario: "Web page with anchors", url: "https://test.com/auth/login#test"},
      {scenario: "Web page with no domain", url: "https://auth/login"},
    ]).describe("should parse", _props => {
      it(`should match: ${_props.scenario}`, () => {
        const parseResult = ParseWebIntegrationUrlService.test(_props.url);
        expect.assertions(1);
        expect(parseResult).toBeTruthy();
      });
    });

    each([
      {scenario: "No protocol given", url: "cipherguard.dev/auth/login"},
      {scenario: "Cipherguard domain", url: domain},
      {scenario: "Chrome page", url: "chrome://settings/"},
      {scenario: "Blank page", url: "about:blank"},
      {scenario: "Config page", url: "about:config"},
      {scenario: "Cipherguard page", url: "https://www.cipherguard.com/"},
      {scenario: "gmail page", url: "https://mail.google.com/"}
    ]).describe("should not parse", _props => {
      it(`should not match: ${_props.scenario}`, () => {
        const parseResult = ParseWebIntegrationUrlService.test(_props.url);
        expect.assertions(1);
        expect(parseResult).toBeFalsy();
      });
    });
  });
});
