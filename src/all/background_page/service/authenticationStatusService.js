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
 * @since         2.11.0
 */
import MfaAuthenticationRequiredError from "../error/mfaAuthenticationRequiredError";
import NotFoundError from "../error/notFoundError";
import {ApiClient} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClient";
import CipherguardBadResponseError from "../error/cipherguardBadResponseError";
import GetActiveAccountService from "./account/getActiveAccountService";
import BuildApiClientOptionsService from "./account/buildApiClientOptionsService";

const AUTH_RESOURCE_NAME = '/auth';

class AuthenticationStatusService {
  /**
   * Check if the current user is authenticated.
   * @returns {Promise<boolean>}
   */
  static async isAuthenticated() {
    const apiClient = new ApiClient(await this.getApiClientOptions());
    const url = apiClient.buildUrl(`${apiClient.baseUrl.toString()}/is-authenticated`, null);

    const fetchOptions = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json'
      }
    };
    const response = await apiClient.sendRequest('GET', url, null, fetchOptions);

    let responseJson;
    try {
      //Get response on json format
      responseJson = await response.json();
    } catch (error) {
      // If the response cannot be parsed, it's not a Cipherguard API response. It can be a nginx error (504).
      throw new CipherguardBadResponseError();
    }

    if (response.ok) {
      return true;
    }

    // MFA required.
    if (/mfa\/verify\/error\.json$/.test(response.url)) {
      //Retrieve the message error details from json
      throw new MfaAuthenticationRequiredError(null, responseJson.body);
    } else if (response.status === 404) {
      // Entry point not found.
      throw new NotFoundError();
    }

    return false;
  }

  /**
   * Return a built ApiClientOptions for requesting the API.
   * @returns {ApiClientOptions}
   * @private
   */
  static async getApiClientOptions() {
    const account = await GetActiveAccountService.get();
    return BuildApiClientOptionsService.buildFromAccount(account)
      .setResourceName(AUTH_RESOURCE_NAME);
  }
}

export default AuthenticationStatusService;
