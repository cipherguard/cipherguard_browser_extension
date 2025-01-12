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
 * @since         4.10.0
 */
import {defaultExternalFolderDto} from "./externalFolderEntity.test.data";

export const defaultExternalFoldersCollectionDto = (foldersCount = 4, data) => {
  const dtos = [];
  for (let i = 0; i < foldersCount; i++) {
    const dto = defaultExternalFolderDto({name: `folder ${i}`, ...data});
    dtos.push(dto);
  }
  return dtos;
};
