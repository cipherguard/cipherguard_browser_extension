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

import {toThrowEntityValidationErrorOnProperties} from "./toThrowEntityValidationErrorOnProperties";
import {toBeOpenpgpKeySignedBy} from "./toBeOpenpgpKeySignedBy";
import {toBeOpenpgpPublicKey} from "./toBeOpenpgpPublicKey";
import {toBeOpenpgpRevokedKey} from "./toBeOpenpgpRevokedKey";
import {toBeEqualToOpenpgpKey} from "./toBeEqualToOpenpgpKey";
import {toBeOpenpgpPrivateKey} from "./toBeOpenpgpPrivateKey";
import {toThrowCollectionValidationError} from "./toThrowCollectionValidationError";
import {toThrowEntityValidationError} from "./toThrowEntityValidationError";
import {toDecryptAndEqualTo} from "./toDecryptAndEqualTo";

const extensions = {
  toBeEqualToOpenpgpKey,
  toBeOpenpgpKeySignedBy,
  toBeOpenpgpPrivateKey,
  toBeOpenpgpPublicKey,
  toBeOpenpgpRevokedKey,
  toDecryptAndEqualTo,
  toThrowEntityValidationErrorOnProperties,
  toThrowCollectionValidationError,
  toThrowEntityValidationError
};

expect.extend(extensions);
