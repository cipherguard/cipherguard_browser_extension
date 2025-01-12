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
import ParseAuthUrlService from "./parseAuthUrlService";
import {Config} from "../../model/config";

describe("ParseAuthUrlService", () => {
  const domain = "https://cipherguard.dev";

  beforeEach(() => {
    Config.write("user.settings.trustedDomain", domain);
  });

  describe("ParseAuthUrlService:test", () => {
    each([
      {scenario: "Cipherguard login page", url: `${domain}/auth/login`},
      {scenario: "Cipherguard login page with parameters", url: `${domain}/auth/login?locale=en-UK`},
      {scenario: "Cipherguard login page with anchors", url: `${domain}/auth/login#test`}
    ]).describe("should parse", _props => {
      it(`should match: ${_props.scenario}`, () => {
        const parseResult = ParseAuthUrlService.regex.test(_props.url);
        expect.assertions(1);
        expect(parseResult).toBeTruthy();
      });
    });

    each([
      {scenario: "No domain given", url: "https://auth/login"},
      {scenario: "No protocol given", url: "cipherguard.dev/auth/login"},
      {scenario: "Wrong protocol given", url: "http://cipherguard.dev/auth/login"},
      {scenario: "Domain look alike attack", url: `https://cipherguard.dev.attacker.com/auth/login`},
      {scenario: "Sub domain look alike attack", url: `https://attacker.cipherguard.dev.com/auth/login`},
      {scenario: "Regex wild mark attack", url: "https://cipherguardxdev/auth/login"},
      {scenario: "Domain look alike as hash attack", url: `https://www.attacker.com#${domain}`},
      {scenario: "Wrong entry point", url: `${domain}/auth/login/wrong-entry-point`},
    ]).describe("should not parse", _props => {
      it(`should not match: ${_props.scenario}`, () => {
        const parseResult = ParseAuthUrlService.regex.test(_props.url);
        expect.assertions(1);
        expect(parseResult).toBeFalsy();
      });
    });
  });
});
