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
import CsvMozillaPlatformRowParser from "./csvMozillaPlatformRowParser";
import ExternalResourceEntity from "../../../entity/resource/external/externalResourceEntity";
import ResourceTypesCollection from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection";
import {
  resourceTypesCollectionDto
} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection.test.data";
import MetadataTypesSettingsEntity from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity";
import {defaultMetadataTypesSettingsV4Dto, defaultMetadataTypesSettingsV50FreshDto} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity.test.data";
import {RESOURCE_TYPE_PASSWORD_AND_DESCRIPTION_SLUG, RESOURCE_TYPE_V5_DEFAULT_SLUG} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypeSchemasDefinition";

describe("CsvMozillaPlatformRowParser", () => {
  it("can parse Mozilla Platform based browsers csv", () => {
    expect.assertions(5);

    // minimum required fields
    let fields = ["url", "password"];
    expect(CsvMozillaPlatformRowParser.canParse(fields)).toEqual(3);
    // all fields
    fields = ["name", "username", "url", "password"];
    expect(CsvMozillaPlatformRowParser.canParse(fields)).toEqual(4);
    // Missing one required field
    fields = ["name", "username", "url"];
    expect(CsvMozillaPlatformRowParser.canParse(fields)).toEqual(0);
    // Duplicate field
    fields = ["name", "username", "url", "password", "password"];
    expect(CsvMozillaPlatformRowParser.canParse(fields)).toEqual(4);
    // additional fields not supported
    fields = ["url", "password", "Unsupported field"];
    expect(CsvMozillaPlatformRowParser.canParse(fields)).toEqual(3);
  });

  it("parses resource of type resource-with-description with all properties from csv row", () => {
    expect.assertions(2);

    const data = {
      "name": "https://url1.com",
      "username": "Username 1",
      "url": "https://url1.com",
      "password": "Secret 1",
    };
    const resourceTypesCollection = new ResourceTypesCollection(resourceTypesCollectionDto());
    const metadataTypesSettings = new MetadataTypesSettingsEntity(defaultMetadataTypesSettingsV4Dto());
    const expectedResourceType = resourceTypesCollection.items.find(resourceType =>  resourceType.slug === RESOURCE_TYPE_PASSWORD_AND_DESCRIPTION_SLUG);
    const expectedEntity = new ExternalResourceEntity({
      name: data.name,
      username: data.username,
      uri: data.url,
      resource_type_id: expectedResourceType.id,
      secret_clear: data.password,
    });

    const externalResourceEntity = CsvMozillaPlatformRowParser.parse(data, resourceTypesCollection, metadataTypesSettings);

    expect(externalResourceEntity).toBeInstanceOf(ExternalResourceEntity);
    expect(externalResourceEntity.toDto()).toEqual(expectedEntity.toDto());
  });

  it("parses resource of type default-v5 with all properties from csv row", () => {
    expect.assertions(2);

    const data = {
      "name": "https://url1.com",
      "username": "Username 1",
      "url": "https://url1.com",
      "password": "Secret 1",
    };
    const resourceTypesCollection = new ResourceTypesCollection(resourceTypesCollectionDto());
    const metadataTypesSettings = new MetadataTypesSettingsEntity(defaultMetadataTypesSettingsV50FreshDto());
    const expectedResourceType = resourceTypesCollection.items.find(resourceType =>  resourceType.slug === RESOURCE_TYPE_V5_DEFAULT_SLUG);
    const expectedEntity = new ExternalResourceEntity({
      name: data.name,
      username: data.username,
      uri: data.url,
      resource_type_id: expectedResourceType.id,
      secret_clear: data.password,
    });

    const externalResourceEntity = CsvMozillaPlatformRowParser.parse(data, resourceTypesCollection, metadataTypesSettings);

    expect(externalResourceEntity).toBeInstanceOf(ExternalResourceEntity);
    expect(externalResourceEntity.toDto()).toEqual(expectedEntity.toDto());
  });
});
