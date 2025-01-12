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
  defaultResourceDto,
  resourceLegacyDto, resourceStandaloneTotpDto, resourceWithTotpDto
} from "cipherguard-styleguide/src/shared/models/entity/resource/resourceEntity.test.data";

/**
 * Build an array of resources containing only a single resource.
 * @returns {array}
 */
export const singleResourceDtos = () => [
  defaultResourceDto({name: "Resource1"}, {withTags: true}),
];

/**
 * Build an array of resources containing multiple resources.
 * @returns {array}
 */
export const multipleResourceDtos = () => [
  resourceLegacyDto({name: "Resource0"}, {withTags: true}),
  defaultResourceDto({name: "Resource1"}, {withTags: true}),
  resourceWithTotpDto({name: "Resource2"}, {withTags: true}),
  resourceStandaloneTotpDto({name: "Resource3"}, {withTags: true}),
];
