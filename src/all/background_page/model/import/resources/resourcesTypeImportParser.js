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

import {RESOURCE_TYPE_PASSWORD_DESCRIPTION_TOTP_SLUG, RESOURCE_TYPE_PASSWORD_STRING_SLUG, RESOURCE_TYPE_V5_DEFAULT_TOTP_SLUG, RESOURCE_TYPE_V5_PASSWORD_STRING_SLUG} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypeSchemasDefinition";

class ResourcesTypeImportParser {
  /**
   * Parse the resource type id
   * @param {object} externalResourceDto the csv row data
   * @param {ResourceTypesCollection} resourceTypesCollection The available resource types
   * @param {MetadataTypesSettingsEntity} metadataTypesSettings The metadata types from the organization
   * @returns {ResourceTypeEntity}
   */
  static parseResourceType(externalResourceDto, resourceTypesCollection, metadataTypesSettings) {
    //Filter resource collection based on defaultResourceTypes settings
    resourceTypesCollection.filterByResourceTypeVersion(metadataTypesSettings.defaultResourceTypes);

    const scores = this.getScores(externalResourceDto, resourceTypesCollection);

    const matchedResourceType = scores
      .filter(score => score.value > 0)              // Supports at least one parsed property
      .filter(score => score.hasRequiredFields)      // Meets all required properties
      .sort((a, b) => b.value - a.value)[0];         // Supports the highest number of properties

    if (!matchedResourceType) {
      throw new Error("No resource type associated to this row.");
    }
    return resourceTypesCollection.getFirst('slug', matchedResourceType.slug);
  }

  /**
   * Get scores for each resources based on the resourceTypes
   * @param {object} externalResourceDto the csv row data
   * @param {ResourceTypesCollection} resourceTypesCollection The available resource types
   * @returns {ResourceTypeEntity}
   */
  static getScores(externalResourceDto, resourceTypesCollection) {
    const scores = [];

    for (let i = 0; i < resourceTypesCollection.length; i++) {
      const resourceType = resourceTypesCollection.items[i];

      //Skip legacy resourceType if it exists
      if (resourceType.slug === RESOURCE_TYPE_PASSWORD_STRING_SLUG || resourceType.slug === RESOURCE_TYPE_V5_PASSWORD_STRING_SLUG) {
        continue;
      }

      const resourceProperties = Object.entries(externalResourceDto)
        .filter(([, value]) => {
          if (typeof value === 'string') {
            return value.length > 0; // Exclude empty strings
          }
          return true;
        })
        .map(([key]) => key === 'secret_clear' ? 'password' : key);

      // Exception to be removed with v5: we need to include password in the resource
      if ((resourceType.slug === RESOURCE_TYPE_PASSWORD_DESCRIPTION_TOTP_SLUG || resourceType.slug === RESOURCE_TYPE_V5_DEFAULT_TOTP_SLUG) && resourceProperties.includes("totp") &&  resourceProperties.includes("description")) {
        resourceProperties.push("password");
      }
      const secretsFields = Object.keys(resourceType.definition.secret.properties);
      const secretsRequiredFields = resourceType.definition.secret.required;
      const score = resourceProperties.filter(value => secretsFields.includes(value));
      const matchAllRequiredField = secretsRequiredFields.every(secretsField => score.includes(secretsField));

      scores.push({
        slug: resourceType.slug,
        value: score.length,
        hasRequiredFields: matchAllRequiredField,
        match: score.length === secretsFields.length,
      });
    }

    return scores;
  }
}

export default ResourcesTypeImportParser;
