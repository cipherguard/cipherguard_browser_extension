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
import AccountSetupEntity from "../../model/entity/account/accountSetupEntity";
import ParseSetupUrlService from "./parseSetupUrlService";

class BuildAccountSetupService {
  /**
   * Build account setup from a setup url.
   * @param {string} url The url to extract the account setup properties.
   * @returns {AccountSetupEntity}
   */
  static buildFromSetupUrl(url) {
    if (typeof url != "string") {
      throw new TypeError("Url should be a valid string.");
    }
    const parseSetupUrl = ParseSetupUrlService.parse(url);
    return new AccountSetupEntity(parseSetupUrl);
  }
}

export default BuildAccountSetupService;
