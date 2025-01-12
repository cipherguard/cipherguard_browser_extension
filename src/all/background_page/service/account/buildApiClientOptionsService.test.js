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

import AccountEntity from "../../model/entity/account/accountEntity";
import {adminAccountDto} from "../../model/entity/account/accountEntity.test.data";
import BuildApiClientOptionsService from "./buildApiClientOptionsService";

describe("BuildAccountApiClientOptionsService", () => {
  it("BuildAccountApiClientOptionsService:buildFromAccount", async() => {
    expect.assertions(3);
    // data
    const csrfToken = "csrf-token";
    const account = new AccountEntity(adminAccountDto());
    // mocked function
    jest.spyOn(browser.cookies, "get").mockImplementationOnce(() => ({value: csrfToken}));
    // execution
    const apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
    const headers = await apiClientOptions.getHeaders();
    // expectations
    expect(apiClientOptions.baseUrl).toStrictEqual(new URL(account.domain));
    expect(headers).toStrictEqual({"X-CSRF-Token": csrfToken});
    expect(browser.cookies.get).toHaveBeenCalledWith({name: "csrfToken", url: `${account.domain}/`});
  });

  it("BuildAccountApiClientOptionsService:buildFromDomain with no subdomain", async() => {
    expect.assertions(3);
    // data
    const csrfToken = "csrf-token";
    const domain = "https://cipherguard.local";
    // mocked function
    jest.spyOn(browser.cookies, "get").mockImplementationOnce(() => ({value: csrfToken}));
    // execution
    const apiClientOptions = BuildApiClientOptionsService.buildFromDomain(domain);
    const headers = await apiClientOptions.getHeaders();
    // expectations
    expect(apiClientOptions.baseUrl).toStrictEqual(new URL(domain));
    expect(headers).toStrictEqual({"X-CSRF-Token": csrfToken});
    expect(browser.cookies.get).toHaveBeenCalledWith({name: "csrfToken", url: `${domain}/`});
  });

  it("BuildAccountApiClientOptionsService:buildFromDomain with slash at the end of a trusted domain", async() => {
    expect.assertions(3);
    // data
    const csrfToken = "csrf-token";
    const domain = "https://cipherguard.local/";
    // mocked function
    jest.spyOn(browser.cookies, "get").mockImplementationOnce(() => ({value: csrfToken}));
    // execution
    const apiClientOptions = BuildApiClientOptionsService.buildFromDomain(domain);
    const headers = await apiClientOptions.getHeaders();
    // expectations
    expect(apiClientOptions.baseUrl).toStrictEqual(new URL(domain));
    expect(headers).toStrictEqual({"X-CSRF-Token": csrfToken});
    expect(browser.cookies.get).toHaveBeenCalledWith({name: "csrfToken", url: domain});
  });

  it("BuildAccountApiClientOptionsService:buildFromDomain with subdomain", async() => {
    expect.assertions(3);
    // data
    const csrfToken = "csrf-token";
    const domain = "https://cipherguard.local/test";
    // mocked function
    jest.spyOn(browser.cookies, "get").mockImplementationOnce(() => ({value: csrfToken}));
    // execution
    const apiClientOptions = BuildApiClientOptionsService.buildFromDomain(domain);
    const headers = await apiClientOptions.getHeaders();
    // expectations
    expect(apiClientOptions.baseUrl).toStrictEqual(new URL(domain));
    expect(headers).toStrictEqual({"X-CSRF-Token": csrfToken});
    expect(browser.cookies.get).toHaveBeenCalledWith({name: "csrfToken", url: `${domain}/`});
  });
});
