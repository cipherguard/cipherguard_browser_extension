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
import CsvBitWardenRowParser from "./csvBitWardenRowParser";
import {
  resourceTypesCollectionDto
} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection.test.data";
import ResourceTypesCollection from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection";
import {defaultMetadataTypesSettingsV4Dto, defaultMetadataTypesSettingsV50FreshDto} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity.test.data";
import MetadataTypesSettingsEntity from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity";
import {RESOURCE_TYPE_PASSWORD_AND_DESCRIPTION_SLUG, RESOURCE_TYPE_V5_DEFAULT_SLUG} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypeSchemasDefinition";

describe("CsvBitWardenRowParser", () => {
  it("can parse BitWarden csv", () => {
    expect.assertions(5);

    // minimum required fields
    let fields = ["name", "login_password"];
    expect(CsvBitWardenRowParser.canParse(fields)).toEqual(2);
    // all fields
    fields = ["name", "login_username", "login_uri", "login_password", "notes", "folder"];
    expect(CsvBitWardenRowParser.canParse(fields)).toEqual(6);
    // Missing one required field
    fields = ["name", "login_username", "login_uri", "notes", "folder"];
    expect(CsvBitWardenRowParser.canParse(fields)).toEqual(0);
    // Duplicate field
    fields = ["name", "login_username", "login_uri", "login_password", "notes", "folder", "folder"];
    expect(CsvBitWardenRowParser.canParse(fields)).toEqual(6);
    // additional fields not supported
    fields = ["name", "login_password", "Unsupported field"];
    expect(CsvBitWardenRowParser.canParse(fields)).toEqual(2);
  });

  it("parses resource of type password-with-description with all properties from csv row", () => {
    expect.assertions(2);

    const data = {
      "name": "Password 1",
      "login_username": "Username 1",
      "login_uri": "https://url1.com",
      "login_password": "Secret 1",
      "notes": "Description 1",
      "folder": "Folder 1"
    };
    const resourceTypesCollection = new ResourceTypesCollection(resourceTypesCollectionDto());
    const metadataTypesSettings = new MetadataTypesSettingsEntity(defaultMetadataTypesSettingsV4Dto());
    const expectedResourceType = resourceTypesCollection.items.find(resourceType =>  resourceType.slug === RESOURCE_TYPE_PASSWORD_AND_DESCRIPTION_SLUG);
    const expectedEntity = new ExternalResourceEntity({
      name: data.name,
      username: data.login_username,
      uri: data.login_uri,
      resource_type_id: expectedResourceType.id,
      secret_clear: data.login_password,
      description: data.notes,
      folder_parent_path: data.folder,
    });

    const externalResourceEntity = CsvBitWardenRowParser.parse(data, resourceTypesCollection, metadataTypesSettings);

    expect(externalResourceEntity).toBeInstanceOf(ExternalResourceEntity);
    expect(externalResourceEntity.toDto()).toEqual(expectedEntity.toDto());
  });

  it("parses resource of type default-v5 with all properties from csv row", () => {
    expect.assertions(2);

    const data = {
      "name": "Password 1",
      "login_username": "Username 1",
      "login_uri": "https://url1.com",
      "login_password": "Secret 1",
      "notes": "Description 1",
      "folder": "Folder 1"
    };
    const resourceTypesCollection = new ResourceTypesCollection(resourceTypesCollectionDto());
    const metadataTypesSettings = new MetadataTypesSettingsEntity(defaultMetadataTypesSettingsV50FreshDto());
    const expectedResourceType = resourceTypesCollection.items.find(resourceType =>  resourceType.slug === RESOURCE_TYPE_V5_DEFAULT_SLUG);
    const expectedEntity = new ExternalResourceEntity({
      name: data.name,
      username: data.login_username,
      uri: data.login_uri,
      resource_type_id: expectedResourceType.id,
      secret_clear: data.login_password,
      description: data.notes,
      folder_parent_path: data.folder,
    });

    const externalResourceEntity = CsvBitWardenRowParser.parse(data, resourceTypesCollection, metadataTypesSettings);

    expect(externalResourceEntity).toBeInstanceOf(ExternalResourceEntity);
    expect(externalResourceEntity.toDto()).toEqual(expectedEntity.toDto());
  });
});
