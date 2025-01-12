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

/**
 * Has same url origin
 * @param {string} url1
 * @param {string} url2
 * @return {boolean}
 */
function hasUrlSameOrigin(url1, url2) {
  const urlA = new URL(url1);
  const urlB = new URL(url2);
  return urlA.origin === urlB.origin;
}

export default hasUrlSameOrigin;
