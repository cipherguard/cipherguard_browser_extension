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
 * @since         3.7.0
 */

import each from "jest-each";
import ParsePublicWebsiteUrlService from "./parsePublicWebsiteUrlService";

describe("ParsePublicWebsiteUrlService", () => {
  describe("ParsePublicWebsiteUrlService:parse", () => {
    each([
      {scenario: "Cipherguard website home page", url: "https://www.cipherguard.com"},
      {scenario: "Cipherguard website random page", url: "https://www.cipherguard.com/roadmap"},
      {scenario: "Cipherguard website home page and hash", url: "https://www.cipherguard.com#hash"},
      {scenario: "Cipherguard website random page and hash", url: "https://www.cipherguard.com/roadmap#hash"},
    ]).describe("should parse", _props => {
      it(`should parse: ${_props.scenario}`, () => {
        const parseResult = ParsePublicWebsiteUrlService.regex.test(_props.url);
        expect.assertions(1);
        expect(parseResult).toBeTruthy();
      });
    });

    each([
      {scenario: "No domain given", url: "www.cipherguard.com"},
      {scenario: "Not in https", url: "http://www.cipherguard.com"},
      {scenario: "From the blog", url: "https://blog.cipherguard.com"},
      {scenario: "Domain look alike attack", url: "https://www.cipherguard.com.attacker.com"},
      {scenario: "Domain look alike as parameter attack", url: "https://www.attacker.com?https://www.cipherguard.com"},
      {scenario: "Domain look alike as hash attack", url: "https://www.attacker.com#https://www.cipherguard.com"},
    ]).describe("should not parse", _props => {
      it(`should not parse: ${_props.scenario}`, () => {
        const parseResult = ParsePublicWebsiteUrlService.regex.test(_props.url);
        expect.assertions(1);
        expect(parseResult).toBeFalsy();
      });
    });
  });
});
