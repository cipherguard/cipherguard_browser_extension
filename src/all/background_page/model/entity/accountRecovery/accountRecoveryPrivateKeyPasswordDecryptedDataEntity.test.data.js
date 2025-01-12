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

export const defaultAccountRecoveryPrivateKeyPasswordDecryptedDataDto = data => {
  const defaultData = {
    type: "account-recovery-private-key-password-decrypted-data",
    version: "v1",
    domain: "https://cipherguard.local",
    private_key_user_id: pgpKeys.ada.userId,
    private_key_fingerprint: pgpKeys.ada.fingerprint,
    private_key_secret: "f7cf1fa06f973a9ecbb5f0e2bc6d1830532e53ad50da231036bd6c8c00dd7c7dc6c07b04004615cd6808bea2cb6a4ce4c46f7f36b8865292c0f7a28cd6f56112",
    created: (new Date()).toISOString()
  };

  return Object.assign(defaultData, data);
};
