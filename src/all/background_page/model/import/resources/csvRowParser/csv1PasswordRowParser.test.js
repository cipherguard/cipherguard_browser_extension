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
import Csv1PasswordRowParser from "./csv1PasswordRowParser";
import ExternalResourceEntity from "../../../entity/resource/external/externalResourceEntity";
import {resourceTypesCollectionDto} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection.test.data";
import MetadataTypesSettingsEntity from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity";
import {defaultMetadataTypesSettingsV4Dto, defaultMetadataTypesSettingsV50FreshDto} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataTypesSettingsEntity.test.data";
import ResourceTypesCollection from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection";
import {RESOURCE_TYPE_PASSWORD_AND_DESCRIPTION_SLUG, RESOURCE_TYPE_V5_DEFAULT_SLUG} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypeSchemasDefinition";

describe("Csv1PasswordRowParser", () => {
  it("can parse 1password csv", () => {
    expect.assertions(5);

    // minimum required fields
    let fields = ["Title", "Password"];
    expect(Csv1PasswordRowParser.canParse(fields)).toEqual(2);
    // all fields
    fields = ["Title", "Username", "Url", "Password", "Notes", "Type"];
    expect(Csv1PasswordRowParser.canParse(fields)).toEqual(6);
    // Missing one required field
    fields = ["Title", "Username", "Url", "Notes", "Type"];
    expect(Csv1PasswordRowParser.canParse(fields)).toEqual(0);
    // Duplicate field
    fields = ["Title", "Username", "Url", "Password", "Notes", "Type", "Type"];
    expect(Csv1PasswordRowParser.canParse(fields)).toEqual(6);
    // additional fields not supported
    fields = ["Title", "Password", "Unsupported field"];
    expect(Csv1PasswordRowParser.canParse(fields)).toEqual(2);
  });

  it("parses resource of type resource-with-description with all properties from csv row", () => {
    expect.assertions(2);

    const data = {
      "Title": "Password 1",
      "Username": "Username 1",
      "Url": "https://url1.com",
      "Password": "Secret 1",
      "Notes": "Description 1",
      "Type": "Folder 1"
    };
    const resourceTypesCollection = new ResourceTypesCollection(resourceTypesCollectionDto());
    const metadataTypesSettings = new MetadataTypesSettingsEntity(defaultMetadataTypesSettingsV4Dto());
    const expectedResourceType = resourceTypesCollection.items.find(resourceType =>  resourceType.slug === RESOURCE_TYPE_PASSWORD_AND_DESCRIPTION_SLUG);
    const expectedEntity = new ExternalResourceEntity({
      name: data.Title,
      username: data.Username,
      uri: data.Url,
      resource_type_id: expectedResourceType.id,
      secret_clear: data.Password,
      description: data.Notes,
      folder_parent_path: data.Type,
    });

    const externalResourceEntity = Csv1PasswordRowParser.parse(data, resourceTypesCollection, metadataTypesSettings);

    expect(externalResourceEntity).toBeInstanceOf(ExternalResourceEntity);
    expect(externalResourceEntity.toDto()).toEqual(expectedEntity.toDto());
  });
  it("parses resource of type default-v5 with all properties from csv row", () => {
    expect.assertions(2);

    const data = {
      "Title": "Password 1",
      "Username": "Username 1",
      "Url": "https://url1.com",
      "Password": "Secret 1",
      "Notes": "Description 1",
      "Type": "Folder 1"
    };
    const resourceTypesCollection = new ResourceTypesCollection(resourceTypesCollectionDto());
    const metadataTypesSettings = new MetadataTypesSettingsEntity(defaultMetadataTypesSettingsV50FreshDto());
    const expectedResourceType = resourceTypesCollection.items.find(resourceType =>  resourceType.slug === RESOURCE_TYPE_V5_DEFAULT_SLUG);
    const expectedEntity = new ExternalResourceEntity({
      name: data.Title,
      username: data.Username,
      uri: data.Url,
      resource_type_id: expectedResourceType.id,
      secret_clear: data.Password,
      description: data.Notes,
      folder_parent_path: data.Type,
    });

    const externalResourceEntity = Csv1PasswordRowParser.parse(data, resourceTypesCollection, metadataTypesSettings);

    expect(externalResourceEntity).toBeInstanceOf(ExternalResourceEntity);
    expect(externalResourceEntity.toDto()).toEqual(expectedEntity.toDto());
  });
});
