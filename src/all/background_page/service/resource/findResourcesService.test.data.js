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
 * @since         4.9.4
 */

import {
  defaultResourceDto, resourceLegacyDto, resourceStandaloneTotpDto, resourceUnknownResourceTypeDto,
  resourceWithTotpDto
} from "cipherguard-styleguide/src/shared/models/entity/resource/resourceEntity.test.data";
import {metadata} from "cipherguard-styleguide/test/fixture/encryptedMetadata/metadata";

/**
 * Build an array of resources dto containing resources of different supported types.
 * @returns {array}
 */
export const multipleResourceDtos = (data = {}, options = {}) => [
  resourceLegacyDto({name: "Resource0", ...data}, options),
  defaultResourceDto({name: "Resource1", ...data}, options),
  resourceWithTotpDto({name: "Resource2, ...data"}, options),
  resourceStandaloneTotpDto({name: "Resource3", ...data}, options),
];

/**
 * Build an array of resources dto containing resources of different supported types including resources having
 * unsupported resource types.
 * @returns {array}
 */
export const multipleResourceIncludingUnsupportedResourceTypesDtos = (data = {}, options = {}) => [
  resourceLegacyDto({name: "Resource0", ...data}, options),
  defaultResourceDto({name: "Resource1", ...data}, options),
  resourceUnknownResourceTypeDto({name: "ResourceX", ...data}, options),
  resourceWithTotpDto({name: "Resource2", ...data}, options),
  resourceStandaloneTotpDto({name: "Resource3", ...data}, options),
  resourceUnknownResourceTypeDto({name: "ResourceY", ...data}, options),
];

export const multipleResourceWithMetadataEncrypted = (sharedMetadataKeyId = null) => [
  defaultResourceDto({metadata: metadata.withAdaKey.encryptedMetadata[0], metadata_key_id: null, metadata_key_type: "user_key", personal: true}),
  defaultResourceDto({metadata: metadata.withAdaKey.encryptedMetadata[1], metadata_key_id: null, metadata_key_type: "user_key", personal: true}),
  defaultResourceDto({metadata: metadata.withAdaKey.encryptedMetadata[2], metadata_key_id: null, metadata_key_type: "user_key", personal: true}),
  defaultResourceDto({metadata: metadata.withAdaKey.encryptedMetadata[3], metadata_key_id: null, metadata_key_type: "user_key", personal: true}),
  defaultResourceDto({metadata: metadata.withSharedKey.encryptedMetadata[0], metadata_key_id: sharedMetadataKeyId, metadata_key_type: "shared_key"}),
  defaultResourceDto({metadata: metadata.withSharedKey.encryptedMetadata[1], metadata_key_id: sharedMetadataKeyId, metadata_key_type: "shared_key"}),
  defaultResourceDto({metadata: metadata.withSharedKey.encryptedMetadata[2], metadata_key_id: sharedMetadataKeyId, metadata_key_type: "shared_key"}),
  defaultResourceDto({metadata: metadata.withSharedKey.encryptedMetadata[3], metadata_key_id: sharedMetadataKeyId, metadata_key_type: "shared_key"}),
];
