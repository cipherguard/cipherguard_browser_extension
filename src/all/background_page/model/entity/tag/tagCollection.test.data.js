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
 * @since         4.8.0
 */

import {defaultTagDto} from "./tagEntity.test.data";

/**
 * Build dtos.
 * @param {number} [count=10] The number of dtos.
 * @returns {object}
 */
export const defaultTagsDtos = (count = 10) => {
  const dtos = [];
  for (let i = 0; i < count; i++) {
    const groupDto = defaultTagDto({slug: `tag ${i}`});
    dtos.push(groupDto);
  }
  return dtos;
};

