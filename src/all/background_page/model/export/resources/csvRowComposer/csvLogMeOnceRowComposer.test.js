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
 */
import ExternalResourceEntity from "../../../entity/resource/external/externalResourceEntity";
import CsvLogMeOnceRowComposer from "./csvLogMeOnceRowComposer";

describe("CsvLogMeOnceRowComposer", () => {
  it("can compose logmeonce csv row", () => {
    const dto = {
      "name": "Password 1",
      "username": "Username 1",
      "uri": "https://url1.com",
      "secret_clear": "Secret 1",
      "description": "Description 1",
      "folder_parent_path": "Folder 1"
    };
    const externalResourceEntity = new ExternalResourceEntity(dto);
    const csvRow = CsvLogMeOnceRowComposer.compose(externalResourceEntity);
    expect(csvRow).toBeInstanceOf(Object);
    expect(csvRow.name).toEqual(externalResourceEntity.name);
    expect(csvRow.username).toEqual(externalResourceEntity.username);
    expect(csvRow.url).toEqual(externalResourceEntity.uri);
    expect(csvRow.password).toEqual(externalResourceEntity.secretClear);
    expect(csvRow.note).toEqual(externalResourceEntity.description);
    expect(csvRow.group).toEqual(externalResourceEntity.folderParentPath);
  });
});
