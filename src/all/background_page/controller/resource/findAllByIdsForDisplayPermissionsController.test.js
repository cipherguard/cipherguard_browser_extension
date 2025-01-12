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
 * @since         4.10.1
 */

import {defaultApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions.test.data";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import {multipleResourceDtos} from "../../service/resource/findResourcesService.test.data";
import FindAllByIdsForDisplayPermissionsController from "./findAllByIdsForDisplayPermissionsController";
import ResourcesCollection from "../../model/entity/resource/resourcesCollection";

describe("FindAllByIdsForDisplayPermissionsController", () => {
  let controller, worker;

  beforeEach(() => {
    worker = {
      port: {
        emit: jest.fn()
      }
    };
    const account = new AccountEntity(defaultAccountDto());
    const apiClientOptions = defaultApiClientOptions();
    controller = new FindAllByIdsForDisplayPermissionsController(worker, null, apiClientOptions, account);
  });

  describe("::exec", () => {
    it("should return the resource collection associated to the resource ids", async() => {
      expect.assertions(2);

      const resourcesDto = multipleResourceDtos();
      const resourceIds = resourcesDto.map(resource => resource.id);
      jest.spyOn(controller.findResourcesService.resourceService, "findAll").mockImplementation(() => resourcesDto);
      jest.spyOn(controller.findResourcesService.decryptMetadataService, "decryptAllFromForeignModels")
        .mockImplementation(collection => collection);

      const result = await controller.exec(resourceIds);
      expect(result).toEqual(new ResourcesCollection(resourcesDto));
      expect(controller.findResourcesService.resourceService.findAll).toHaveBeenCalledWith(
        {"permission": true, "permissions.group": true, "permissions.user.profile": true}, {"has-id": resourceIds});
    });

    it("should throw an error if the resource id array is not an array of uuid", async() => {
      expect.assertions(1);

      const promise =  controller.exec([1]);

      await expect(promise).rejects.toThrowError("The given parameter is not a valid array of uuid");
    });
  });
});
