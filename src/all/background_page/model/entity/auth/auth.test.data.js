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
import {pgpKeys} from "cipherguard-styleguide/test/fixture/pgpKeys/keys";

export const defaultVerifyDto = (data = {}) => {
  const defaultData = {
    fingerprint: pgpKeys.server.fingerprint,
    keydata: pgpKeys.server.public,
  };

  return Object.assign(defaultData, data);
};
