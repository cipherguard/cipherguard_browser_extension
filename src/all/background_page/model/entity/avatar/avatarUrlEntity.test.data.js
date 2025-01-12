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
 * @since         4.9.0
 */

/**
 * Default avatar url dto.
 * @param {object} data The data to override
 * @returns {object}
 */
export const defaultAvatarUrlDto = (data = {}) => ({
  "medium": "img\/avatar\/user_medium.png",
  "small": "img\/avatar\/user.png",
  ...data
});
