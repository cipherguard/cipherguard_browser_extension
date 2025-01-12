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

import NeededSecretsCollection from "./neededSecretsCollection";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import * as assertEntityProperty from "cipherguard-styleguide/test/assert/assertEntityProperty";
import {defaultNeededSecretDto} from "cipherguard-styleguide/src/shared/models/entity/secret/neededSecretEntity.test.data";
import {defaultNeededSecretsDtos} from "cipherguard-styleguide/src/shared/models/entity/secret/neededSecretCollection.test.data";
import expect from "expect";

describe("Needed secrets collection entity", () => {
  describe("::getSchema", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(NeededSecretsCollection.constructor.name, NeededSecretsCollection.getSchema());
    });

    it("validates collection is an array", () => {
      assertEntityProperty.collection(NeededSecretsCollection);
    });
  });

  describe("::constructor", () => {
    it("works if valid minimal DTO is provided", () => {
      expect.assertions(1);

      const dtos = [defaultNeededSecretDto()];
      const collection = new NeededSecretsCollection(dtos);
      expect(collection.toDto()).toEqual(dtos);
    });
  });

  describe(":pushMany", () => {
    it("[performance] should ensure performance adding large dataset remains effective.", async() => {
      const count = 10_000;
      const dtos = defaultNeededSecretsDtos(count);

      const start = performance.now();
      const collection = new NeededSecretsCollection(dtos);
      const time = performance.now() - start;
      expect(collection).toHaveLength(count);
      expect(time).toBeLessThan(5_000);
    });
  });
});
