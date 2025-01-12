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

class ParsePublicWebsiteUrlService {
  /**
   * Return the public website url matching regex
   * @return {RegExp}
   */
  static get regex() {
    const publicWebsiteDomain = '(www\.)?cipherguard\.com';
    return new RegExp(`^https\:\/\/${publicWebsiteDomain}(\/.*|#.*)?$`);
  }

  /**
   * Test the url against the regex.
   * @param {string} url The url to test
   * @returns {boolean}
   */
  static test(url) {
    return this.regex.test(url);
  }
}

export default ParsePublicWebsiteUrlService;
