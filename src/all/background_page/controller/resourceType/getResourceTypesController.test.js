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

import {enableFetchMocks} from "jest-fetch-mock";
import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import {
  resourceTypesCollectionDto
} from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection.test.data";
import GetResourceTypesController from "./getResourceTypesController";
import ResourceTypesCollection from "cipherguard-styleguide/src/shared/models/entity/resourceType/resourceTypesCollection";

beforeEach(() => {
  enableFetchMocks();
});

jest.mock("../../service/passphrase/getPassphraseService");

describe("GetResourceTypesController", () => {
  describe("GetResourceTypesController::exec", () => {
    it("Get or find resource types.", async() => {
      expect.assertions(2);

      const resourceTypesDto = resourceTypesCollectionDto();
      const controller = new GetResourceTypesController(null, null, defaultApiClientOptions());
      jest.spyOn(controller.resourceTypeModel, "getOrFindAll").mockImplementationOnce(() => new ResourceTypesCollection(resourceTypesDto));

      const resourceTypesCollection = await controller.exec();
      expect(resourceTypesCollection).toBeInstanceOf(ResourceTypesCollection);
      expect(resourceTypesCollection.toDto()).toEqual(resourceTypesDto);
    });
  });
});
