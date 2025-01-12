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
 * @since         2.13.0
 */
import FolderEntity from "./folderEntity";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import PermissionEntity from "../permission/permissionEntity";
import {
  defaultFolderDto,
  folderWithReadPermissionDto,
  folderWithUpdatePermissionDto,
  minimalFolderDto
} from "cipherguard-styleguide/src/shared/models/entity/folder/folderEntity.test.data";
import {ownerPermissionDto} from "cipherguard-styleguide/src/shared/models/entity/permission/permissionEntity.test.data";
import PermissionsCollection from "../permission/permissionsCollection";
import * as assertEntityProperty from "cipherguard-styleguide/test/assert/assertEntityProperty";
import UserEntity from "../user/userEntity";

describe("FolderEntity", () => {
  describe("FolderEntity::getSchema", () => {
    it("schema must validate", () => {
      EntitySchema.validateSchema(FolderEntity.ENTITY_NAME, FolderEntity.getSchema());
    });

    it("validates id property", () => {
      assertEntityProperty.uuid(FolderEntity, "id");
      assertEntityProperty.notRequired(FolderEntity, "id");
    });

    it("validates name property", () => {
      assertEntityProperty.string(FolderEntity, "name");
      assertEntityProperty.required(FolderEntity, "name");
      assertEntityProperty.minLength(FolderEntity, "name", 1);
      assertEntityProperty.maxLength(FolderEntity, "name", 256);
    });

    it("validates folder_parent_id property", () => {
      assertEntityProperty.uuid(FolderEntity, "folder_parent_id");
      assertEntityProperty.nullable(FolderEntity, "folder_parent_id");
      assertEntityProperty.notRequired(FolderEntity, "folder_parent_id");
    });

    it("validates created property", () => {
      assertEntityProperty.string(FolderEntity, "created");
      assertEntityProperty.dateTime(FolderEntity, "created");
      assertEntityProperty.notRequired(FolderEntity, "created");
    });

    it("validates modified property", () => {
      assertEntityProperty.string(FolderEntity, "modified");
      assertEntityProperty.dateTime(FolderEntity, "modified");
      assertEntityProperty.notRequired(FolderEntity, "modified");
    });

    it("validates created_by property", () => {
      assertEntityProperty.uuid(FolderEntity, "created_by");
      assertEntityProperty.notRequired(FolderEntity, "created_by");
    });

    it("validates modified_by property", () => {
      assertEntityProperty.uuid(FolderEntity, "modified_by");
      assertEntityProperty.notRequired(FolderEntity, "modified_by");
    });

    it("validates personal property", () => {
      assertEntityProperty.boolean(FolderEntity, "personal");
      assertEntityProperty.notRequired(FolderEntity, "personal");
      assertEntityProperty.nullable(FolderEntity, "personal");
    });
  });

  it("constructor works if valid minimal DTO is provided", () => {
    const dto = minimalFolderDto();
    const entity = new FolderEntity(dto);
    expect(entity.id).toBeNull();
    expect(entity.name).toEqual('Folder name');
    expect(entity.folderParentId).toBeNull();
    expect(entity.created).toBeNull();
    expect(entity.modified).toBeNull();
    expect(entity.permission).toBeNull();
    expect(entity.permissions).toBeNull();
    expect(entity.isReadOnly()).toBe(false);
    expect(entity.canUpdate()).toBe(false);
    expect(entity.isOwner()).toBe(false);
    expect(entity.isPersonal()).toBe(null);
    expect(entity.isShared()).toBe(null);
  });

  it("constructor works if valid DTO is provided with optional properties", () => {
    const dto = defaultFolderDto({}, {withPermissions: {count: 3}, withCreator: true, withModifier: true});
    const entity = new FolderEntity(dto);
    expect(entity.id).toEqual(dto.id);
    expect(entity.name).toEqual('Accounting');
    expect(entity.folderParentId).toBeNull();
    expect(entity.created).toEqual("2020-02-01T00:00:00+00:00");
    expect(entity.modified).toEqual("2020-02-01T00:00:00+00:00");
    expect(entity.permission).toBeInstanceOf(PermissionEntity);
    expect(entity.permission.toDto()).toEqual(expect.objectContaining({type: 15}));
    expect(entity.permissions).toBeInstanceOf(PermissionsCollection);
    expect(entity.permissions.length).toEqual(3);
    expect(entity._creator).toBeInstanceOf(UserEntity);
    expect(entity._creator.toDto()).toEqual(expect.objectContaining({username: "ada@cipherguard.com"}));
    expect(entity._modifier).toBeInstanceOf(UserEntity);
    expect(entity._modifier.toDto()).toEqual(expect.objectContaining({username: "ada@cipherguard.com"}));
    expect(entity.isReadOnly()).toBe(false);
    expect(entity.canUpdate()).toBe(true);
    expect(entity.isOwner()).toBe(true);
    expect(entity.isPersonal()).toBe(false);
    expect(entity.isShared()).toBe(true);
  });

  it('Should allow personal with null value', async() => {
    expect.assertions(1);
    const dto = defaultFolderDto({
      personal: null
    });
    const entity = new FolderEntity(dto);
    expect(entity.isPersonal()).toBe(null);
  });

  it('Should not accept invalid associated permission', async() => {
    expect.assertions(2);
    const dto = defaultFolderDto({
      permission: ownerPermissionDto({id: "invalid-id"})
    });
    try {
      new FolderEntity(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect(error.hasError('id', 'format')).toBeTruthy();
    }
  });

  it('Should not accept invalid associated permissions', async() => {
    expect.assertions(2);
    const dto = defaultFolderDto({
      permissions: [ownerPermissionDto({id: "invalid-id"})]
    });
    // The error is still incomplete, it should return an EntityValidationError with details on the permissions property.
    expect(() => new FolderEntity(dto))
      .not.toThrowCollectionValidationError("permissions.0.id.format");
    expect(() => new FolderEntity(dto))
      .toThrowCollectionValidationError("0.id.format");
  });

  describe("FolderEntity:toDto", () => {
    it("should return the expected properties.", () => {
      expect.assertions(2);
      const expectedKeys = [
        "id",
        "folder_parent_id",
        "name",
        "created_by",
        "modified_by",
        "created",
        "modified",
        "personal",
      ];

      const dto = defaultFolderDto();
      const entity = new FolderEntity(dto);
      const resultDto = entity.toDto();
      const keys = Object.keys(resultDto);
      expect(keys).toEqual(expectedKeys);
      expect(Object.keys(resultDto).length).toBe(expectedKeys.length);
    });

    it("should return the expected properties containing the associated properties.", () => {
      expect.assertions(6);
      const expectedKeys = [
        "id",
        "folder_parent_id",
        "name",
        "created_by",
        "modified_by",
        "created",
        "modified",
        "personal",
        "creator",
        "modifier",
        "permission",
        "permissions"
      ];

      const dto = defaultFolderDto({}, {withPermissions: true, withCreator: true, withModifier: true});
      const entity = new FolderEntity(dto);
      const resultDto = entity.toDto(FolderEntity.ALL_CONTAIN_OPTIONS);
      const keys = Object.keys(resultDto);
      expect(keys).toEqual(expectedKeys);
      expect(Object.keys(resultDto).length).toBe(expectedKeys.length);
      expect(resultDto.permission.type).toEqual(15);
      expect(resultDto.permissions[0].type).toEqual(15);
      expect(resultDto.creator?.username).toEqual("ada@cipherguard.com");
      expect(resultDto.modifier?.username).toEqual("ada@cipherguard.com");
    });
  });

  describe("FolderEntity:canFolderMove", () => {
    it("folder can move test", () => {
      expect.assertions(22);

      const personalFolderDto = defaultFolderDto({
        "personal": true,
      });
      const personal = new FolderEntity(personalFolderDto);

      // Should not crash when value is null
      const personalNullFolderDto = defaultFolderDto({
        "personal": null,
      });
      const personalNullFolder = new FolderEntity(personalNullFolderDto);

      const sharedOwnerDto = defaultFolderDto({
        "personal": false,
      });
      const sharedOwner = new FolderEntity(sharedOwnerDto);

      const sharedUpdateDto = folderWithUpdatePermissionDto({
        "personal": false,
      });
      const sharedUpdate = new FolderEntity(sharedUpdateDto);

      const sharedReadDto = folderWithReadPermissionDto({
        "personal": false,
      });
      const sharedRead = new FolderEntity(sharedReadDto);

      /*
       * CANNOT MOVE
       * Share folder read to folder to the root
       */
      expect(FolderEntity.canFolderMove(sharedRead, sharedRead, null)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, sharedUpdate, null)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, sharedOwner, null)).toBe(false);
      // Share folder read to folder I own
      expect(FolderEntity.canFolderMove(sharedRead, sharedRead, sharedOwner)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, sharedUpdate, sharedOwner)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, sharedOwner, sharedOwner)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, personal, sharedOwner)).toBe(false);
      // Share folder read to folder I own
      expect(FolderEntity.canFolderMove(sharedRead, sharedRead, sharedUpdate)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, sharedUpdate, sharedUpdate)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, sharedOwner, sharedUpdate)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, personal, sharedUpdate)).toBe(false);
      expect(FolderEntity.canFolderMove(sharedRead, personalNullFolder, sharedUpdate)).toBe(null);

      /*
       * CAN MOVE
       * Read folder in a personal folder
       */
      expect(FolderEntity.canFolderMove(sharedRead, personal, null)).toBe(true);
      expect(FolderEntity.canFolderMove(sharedRead, personal, personal)).toBe(true);
      expect(FolderEntity.canFolderMove(sharedRead, null, personal)).toBe(true);
      // Moving a personal folder in a personal  folder to the root
      expect(FolderEntity.canFolderMove(personal, personal, null)).toBe(true);
      expect(FolderEntity.canFolderMove(sharedOwner, sharedOwner, sharedOwner)).toBe(true);
      expect(FolderEntity.canFolderMove(sharedOwner, sharedRead, sharedOwner)).toBe(true);
      expect(FolderEntity.canFolderMove(sharedUpdate, sharedRead, sharedUpdate)).toBe(true);
      // Moving a personal folder at the root
      expect(FolderEntity.canFolderMove(personal, null, sharedUpdate)).toBe(true);
      expect(FolderEntity.canFolderMove(personal, null, null)).toBe(true);
      expect(FolderEntity.canFolderMove(sharedOwner, null, sharedOwner)).toBe(true);
    });
  });
});
