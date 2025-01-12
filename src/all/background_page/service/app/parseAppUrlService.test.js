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
import {Config} from "../../model/config";
import ParseAppUrlService from "./parseAppUrlService";

const errorMatchPattern =
  "Cannot parse application url. The url does not match the pattern.";
const errorDomainInvalid =
  "Cannot parse application url. The domain is not valid.";

const domain = "https://cipherguard.dev";

beforeEach(() => {
  Config.write("user.settings.trustedDomain", "https://cipherguard.dev");
});

describe("ParseAppUrlService", () => {
  describe("ParseAppUrlService:parse", () => {
    each([
      {
        scenario: "TLD",
        url: "https://cipherguard.dev/app/folders/view/5452ecb2-0625-50d1-b1ef-d2038f5830b6",
        domain: domain,
      },
      {
        scenario: "TLD with Port",
        url: "https://cipherguard.dev:4443/app/passwords",
        domain: `${domain}:4443`,
      },
      {
        scenario: "Non tld",
        url: "https://cipherguard/app/users",
        domain: "https://cipherguard",
      },
      {
        scenario: "IP v4",
        url: "https://127.0.0.1/app/administration/mfa",
        domain: "https://127.0.0.1",
      },
      {
        scenario: "IP v4 with port",
        url: "https://127.0.0.1:4443/app/administration/users-directory",
        domain: "https://127.0.0.1:4443",
      },
      {
        scenario: "IP v6",
        url: "https://[0:0:0:0:0:0:0:1]/app/administration/internationalization",
        domain: "https://[0:0:0:0:0:0:0:1]",
      },
      {
        scenario: "IP v6 with port",
        url: "https://[0:0:0:0:0:0:0:1]:4443/app/administration/subscription",
        domain: "https://[0:0:0:0:0:0:0:1]:4443",
      },
      {
        scenario: "Trailing /",
        url: "https://cipherguard.dev/app/administration/account-recovery//",
        domain: `${domain}/app/administration/account-recovery/`,
      },
      {
        scenario: "Hash on domain",
        url: "https://demo.cipherguard.com/#hash",
        domain: `https://demo.cipherguard.com`,
      },
      {
        scenario: "Hash in subpaths",
        url: "https://demo.cipherguard.com/app/users#hash",
        domain: `https://demo.cipherguard.com`,
      },
    ]).describe("should parse", _props => {
      beforeEach(() => {
        Config.write("user.settings.trustedDomain", _props.domain);
      });
      it(`should parse: ${_props.scenario}`, () => {
        expect.assertions(2);
        expect(() => ParseAppUrlService.parse(_props.url)).not.toThrow(
          errorMatchPattern
        );
        expect(() => ParseAppUrlService.parse(_props.url)).not.toThrow(
          errorDomainInvalid
        );
      });
    });

    each([
      {
        scenario: "No domain",
        url: "/passwords",
      },
      {
        scenario: "Wrong protocol",
        url: "http://cipherguard.dev",
      },
      {
        scenario: "Not a domain allowed",
        url: "https://cipherguard.io/passwords",
      },
      {
        scenario: "Original domain as subdomain attack",
        url: "https://cipherguard.dev.attacker.com"
      },
      {
        scenario: "Subdomain attack",
        url: "https://attack.cipherguard.dev"
      },
      {
        scenario: "Regex wild mark attack",
        url: "https://cipherguardxdev"
      },
      {
        scenario: "Non application entry point",
        url: "https://cipherguard.dev/auth/login"
      },
      {
        scenario: "Domain look alike as hash attack",
        url: `https://www.attacker.com#${domain}`
      },
    ]).describe("should not parse", _props => {
      it(`should not parse: ${_props.scenario}`, () => {
        expect.assertions(1);
        expect(() => ParseAppUrlService.parse(_props.url)).toThrowError(
          errorMatchPattern
        );
      });
    });
  });
  describe("ParseAppUrlService:getContext", () => {
    it(`should return regex based on trusted domain`, () => {
      expect.assertions(1);
      expect(ParseAppUrlService.getRegex()).toBe(
        "^https\\:\\/\\/cipherguard\\.dev/?(/app.*)?(#.*)?$"
      );
    });
    it(`should escaped characters from domain`, () => {
      Config.write("user.settings.trustedDomain", "https://cipherguard.dev/#/");
      expect.assertions(1);
      expect(ParseAppUrlService.getRegex()).toBe(
        "^https\\:\\/\\/cipherguard\\.dev\\/\\#\\//?(/app.*)?(#.*)?$"
      );
    });
  });
});
