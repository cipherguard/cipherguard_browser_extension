/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.0.0
 */
import Pagemod from "./pagemod";

/**
 * This is class is only useful for firefox to allowed download file without the permission
 */
class FileIframe extends Pagemod {
  /**
   * @inheritDoc
   * @returns {string}
   */
  get appName() {
    return "FileIframe";
  }
}

export default new FileIframe();
