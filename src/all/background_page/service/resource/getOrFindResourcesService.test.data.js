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

/**
 * Build an array of resources dto containing resources of different supported types.
 * @returns {array}
 */
export const multipleResourceDtos = () => [
  resourceLegacyDto({}, {withTags: true}),
  defaultResourceDto({}, {withTags: true}),
  resourceWithTotpDto({}, {withTags: true}),
  resourceStandaloneTotpDto({}, {withTags: true}),
];

/**
 * Build an array of resources dto containing resources of different supported types including resources having
 * unsupported resource types.
 * @returns {array}
 */
export const multipleResourceIncludingUnsupportedResourceTypesDtos = () => [
  resourceLegacyDto({}, {withTags: true}),
  defaultResourceDto({}, {withTags: true}),
  resourceUnknownResourceTypeDto({}, {withTags: true}),
  resourceWithTotpDto({}, {withTags: true}),
  resourceStandaloneTotpDto({}, {withTags: true}),
  resourceUnknownResourceTypeDto({}, {withTags: true}),
];
