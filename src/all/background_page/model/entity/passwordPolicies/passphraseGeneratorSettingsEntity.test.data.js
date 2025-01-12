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
 * @since         4.3.0
 */

export const defaultPassphraseGeneratorSettings = (data = {}) => {
  const defaultData = {
    words: 9,
    word_separator: " ",
    word_case: "lowercase",
    min_words: 4,
    max_words: 40,
  };
  return Object.assign(defaultData, data);
};
