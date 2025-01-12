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
const {pgpKeys} = require("cipherguard-styleguide/test/fixture/pgpKeys/keys");

exports.dummyData = {
  viableKey: pgpKeys.test_no_expiry_with_secret.public,
  privateKey: pgpKeys.ada.private,
  weakKey: pgpKeys.user42.public,
  expiredKey: pgpKeys.lynne.public,
  existingKey: pgpKeys.ada.public,
  serverKey: pgpKeys.user76.public,
  invalidKey: pgpKeys.invalidKeyWithoutChecksum.private,
  notAKey: ":D"
};
