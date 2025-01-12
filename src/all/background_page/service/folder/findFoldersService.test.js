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

import {ApiClientOptions} from "cipherguard-styleguide/src/shared/lib/apiClient/apiClientOptions";
import FindFoldersService from "./findFoldersService";
import {defaultFolderDto} from "cipherguard-styleguide/src/shared/models/entity/folder/folderEntity.test.data";
import FolderLocalStorage from "../local_storage/folderLocalStorage";
import FolderService from "../api/folder/folderService";
import FoldersCollection from "../../model/entity/folder/foldersCollection";
import {
  defaultPermissionDto
} from "cipherguard-styleguide/src/shared/models/entity/permission/permissionEntity.test.data.js";
import {v4 as uuidv4} from "uuid";
import FolderEntity from "../../model/entity/folder/folderEntity";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("FindFoldersService", () => {
  let service;

  beforeEach(async() => {
    const apiClientOptions = new ApiClientOptions().setBaseUrl('https://localhost');
    service = new FindFoldersService(apiClientOptions);
  });

  describe("::findAll", () => {
    it("retrieves folders with no contains.", async() => {
      expect.assertions(1);
      const folderDto1 = defaultFolderDto();
      const folderDto2 = defaultFolderDto();
      const foldersDto = [folderDto1, folderDto2];
      jest.spyOn(FolderService.prototype, "findAll").mockImplementation(() => foldersDto);

      const folders = await service.findAll();

      expect(folders.toDto()).toEqual(foldersDto);
    });

    it("should throw error if contains is not supported.", async() => {
      expect.assertions(1);
      const promise = service.findAll({unknown: true});
      await expect(promise).rejects.toThrowError("Unsupported contains parameter used, please check supported contains");
    });

    it("should throw error if filter is not supported.", async() => {
      expect.assertions(1);
      const promise = service.findAll({}, {unknown: true});
      await expect(promise).rejects.toThrowError("Unsupported filters parameter used, please check supported filters");
    });

    it("should throw error if ignoreInvalidEntity option is not a boolean.", async() => {
      expect.assertions(1);
      const promise = service.findAll({}, {}, {ignoreInvalidEntity: 42});
      await expect(promise).rejects.toThrowError("The given parameter is not a valid boolean");
    });
  });

  describe("::findAllForLocalStorage", () => {
    it("uses the contains required by the local storage.", async() => {
      expect.assertions(3);
      jest.spyOn(FolderService.prototype, "findAll").mockImplementation(() => []);
      jest.spyOn(FindFoldersService.prototype, "findAll");

      const folders = await service.findAllForLocalStorage();

      expect(service.folderService.findAll).toHaveBeenCalledWith(FolderLocalStorage.DEFAULT_CONTAIN, null);
      expect(service.findAll).toHaveBeenCalledWith(FolderLocalStorage.DEFAULT_CONTAIN, null, {ignoreInvalidEntity: true});
      expect(folders).toBeInstanceOf(FoldersCollection);
    });

    it("should not throw an error if required field is missing with ignore strategy", async() => {
      expect.assertions(2);
      const folderDto1 = defaultFolderDto();
      const folderDto2 = defaultFolderDto();
      const multipleFolders = [folderDto1, folderDto2];
      const foldersCollectionDto = multipleFolders.concat([defaultFolderDto({
        name: null
      })]);
      jest.spyOn(FolderService.prototype, "findAll").mockImplementation(() => foldersCollectionDto);
      const expectedRetainedFolder = [multipleFolders[0], multipleFolders[1]];

      const collection = await service.findAllForLocalStorage();

      expect(collection).toHaveLength(2);
      expect(collection.toDto(FolderLocalStorage.DEFAULT_CONTAIN)).toEqual(expectedRetainedFolder);
    });
  });

  describe("::findByID", () => {
    it("retrieves folder by id.", async() => {
      expect.assertions(1);
      const folderId = uuidv4();
      const folderDto = defaultFolderDto({id: folderId});
      jest.spyOn(FolderService.prototype, "get").mockImplementation(() => folderDto);

      const folder = await service.findById(folderDto.id);

      expect(folder.toDto(FolderEntity.ALL_CONTAIN_OPTIONS)).toEqual(folderDto);
    });

    it("should throw an error if id is not a uuid", async() => {
      expect.assertions(1);
      const promise = service.findById();
      await expect(promise).rejects.toThrowError("The given parameter is not a valid UUID");
    });

    it("should throw error if contains is not supported.", async() => {
      expect.assertions(1);
      const promise = service.findById(uuidv4(), {unknown: true});
      await expect(promise).rejects.toThrowError("Unsupported contains parameter used, please check supported contains");
    });
  });

  describe("::findByIdWithPermission", () => {
    it("retrieves folder with permissions contains.", async() => {
      expect.assertions(2);
      const folderId = uuidv4();
      const folderDto = defaultFolderDto({id: folderId, permissions: [
        defaultPermissionDto({aco: "Folder", aco_foreign_key: folderId}, {withUser: true}),
        defaultPermissionDto({aco: "Folder", aco_foreign_key: folderId}, {withGroup: true})
      ]});
      jest.spyOn(FolderService.prototype, "get").mockImplementation(() => folderDto);
      jest.spyOn(FindFoldersService.prototype, "findById");

      const folder = await service.findByIdWithPermissions(folderDto.id);

      expect(service.findById).toHaveBeenCalledWith(folderDto.id, {'permissions.user.profile': true, 'permissions.group': true, "permission": true});
      expect(folder.toDto(FolderEntity.ALL_CONTAIN_OPTIONS)).toEqual(folderDto);
    });

    it("should throw an error if id is not a uuid", async() => {
      expect.assertions(1);
      const promise = service.findByIdWithPermissions();
      await expect(promise).rejects.toThrowError("The given parameter is not a valid UUID");
    });
  });

  describe("::findByIdWithCreatorAndModifier", () => {
    it("retrieves folder with permissions contains.", async() => {
      expect.assertions(2);
      const folderDto = defaultFolderDto({}, {withCreator: true, withModifier: true});
      jest.spyOn(FolderService.prototype, "get").mockImplementation(() => folderDto);
      jest.spyOn(FindFoldersService.prototype, "findById");

      const folder = await service.findByIdWithCreatorAndModifier(folderDto.id);

      expect(service.findById).toHaveBeenCalledWith(folderDto.id, {creator: true, modifier: true});
      expect(folder.toDto(FolderEntity.ALL_CONTAIN_OPTIONS)).toEqual(folderDto);
    });

    it("should throw an error if id is not a uuid", async() => {
      expect.assertions(1);
      const promise = service.findByIdWithCreatorAndModifier();
      await expect(promise).rejects.toThrowError("The given parameter is not a valid UUID");
    });
  });

  describe("::findAllByIds", () => {
    it("calls the api only 1 times when the ids array length is less than the limit of 80", async() => {
      expect.assertions(3);

      const dtos = Array.from({length: 79}, () => defaultFolderDto());
      const ids = dtos.map(dto => dto.id);
      jest.spyOn(service.folderService, "findAll").mockImplementation(() => dtos);

      const result = await service.findAllByIds(ids);

      expect(result).toEqual(new FoldersCollection(dtos));
      expect(service.folderService.findAll).toHaveBeenCalledTimes(1);
      expect(service.folderService.findAll).toHaveBeenCalledWith({}, {
        "has-id": ids
      });
    });

    it("calls the api 2 times when the ids array length is between the limit and 2 times the limit", async() => {
      expect.assertions(4);

      const dtos = Array.from({length: 82}, () => defaultFolderDto());
      const ids = dtos.map(collection => collection.id);

      jest.spyOn(service.folderService, "findAll")
        .mockImplementationOnce(() => dtos.slice(0, 80))
        .mockImplementationOnce(() => dtos.slice(80, 82));

      const result = await service.findAllByIds(ids);

      expect(service.folderService.findAll).toHaveBeenCalledTimes(2);
      expect(service.folderService.findAll).toHaveBeenCalledWith({}, {
        "has-id": dtos.map(dto => dto.id).slice(0, 80)
      });
      expect(service.folderService.findAll).toHaveBeenCalledWith({}, {
        "has-id": dtos.map(dto => dto.id).slice(80, 82)
      });
      expect(result.toDto()).toEqual(dtos);
    });

    it("calls the api 3 times when the ids array length is between the limit and 3 times the limit", async() => {
      expect.assertions(5);

      const dtos = Array.from({length: 162}, () => defaultFolderDto());
      const ids = dtos.map(collection => collection.id);

      jest.spyOn(service.folderService, "findAll")
        .mockImplementationOnce(() => dtos.slice(0, 80))
        .mockImplementationOnce(() => dtos.slice(80, 160))
        .mockImplementationOnce(() => dtos.slice(160, 162));

      const result = await service.findAllByIds(ids);

      expect(service.folderService.findAll).toHaveBeenCalledTimes(3);
      expect(service.folderService.findAll).toHaveBeenCalledWith({}, {
        "has-id": dtos.map(dto => dto.id).slice(0, 80)
      });
      expect(service.folderService.findAll).toHaveBeenCalledWith({}, {
        "has-id": dtos.map(dto => dto.id).slice(80, 160)
      });
      expect(service.folderService.findAll).toHaveBeenCalledWith({}, {
        "has-id": dtos.map(dto => dto.id).slice(160, 162)
      });
      expect(result.toDto()).toEqual(dtos);
    });
  });
});
