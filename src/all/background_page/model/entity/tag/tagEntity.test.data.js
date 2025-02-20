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
 * @since         4.6.0
 */

export const minimalTagDto = (data = {}) => ({
  slug: "minimal-tag",
  ...data
});

export const defaultTagDto = (data = {}) => ({
  id: crypto.randomUUID(),
  slug: "personal-tag",
  is_shared: false,
  ...data
});

export const sharedTagDto = (data = {}) => defaultTagDto({
  slug: "#shared-tag",
  is_shared: true,
  ...data
});
