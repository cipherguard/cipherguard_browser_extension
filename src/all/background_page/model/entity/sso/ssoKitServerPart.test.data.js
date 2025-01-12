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
 * @since         3.9.0
 */

export const generateSsoKitServerData = ({alg = "A256GCM", ext = true, k = "string", key_ops = ["encrypt", "decrypt"], kty = "oct"} = {}) => {
  const key = {alg, ext, k, key_ops, kty};
  return Buffer.from(JSON.stringify(key)).toString("base64");
};
