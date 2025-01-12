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
import ImportResourcesFileEntity from "../entity/import/importResourcesFileEntity";
import ResourcesKdbxImportParser from "./resources/resourcesKdbxImportParser";
import ResourcesCsvImportParser from "./resources/resourcesCsvImportParser";
import FileTypeError from "../../error/fileTypeError";

class ResourcesImportParser {
  /**
   * Parse import
   * @param {ImportResourcesFileEntity} importEntity The import to parse
   * @param {ResourceTypesCollection} resourceTypesCollection The available resource types
   * @param {MetadataTypesSettingsEntity} metadataTypesSettings The metadata types from the organization
   * @returns {Promise<void>}
   */
  parseImport(importResourcesEntity, resourceTypesCollection, metadataTypesSettings) {
    const Parser = this.getParser(importResourcesEntity);
    const parser = new Parser(importResourcesEntity, resourceTypesCollection, metadataTypesSettings);

    return parser.parseImport();
  }

  /**
   * Get the import parser based on the import entity
   * @param {ImportResourcesFileEntity} importEntity The import
   * @returns {Class}
   * @throws {FileTypeError} If the import file type is not supported
   */
  getParser(importEntity) {
    switch (importEntity.fileType.toLowerCase()) {
      case ImportResourcesFileEntity.FILE_TYPE_CSV:
        return ResourcesCsvImportParser;
      case ImportResourcesFileEntity.FILE_TYPE_KDBX:
        return ResourcesKdbxImportParser;
      default:
        throw new FileTypeError(`The file type ${importEntity.fileType} is not supported`);
    }
  }
}

export default ResourcesImportParser;
