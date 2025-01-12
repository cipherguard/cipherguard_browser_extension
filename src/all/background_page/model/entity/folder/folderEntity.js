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
import EntitySchema from "cipherguard-styleguide/src/shared/models/entity/abstract/entitySchema";
import EntityValidationError from "cipherguard-styleguide/src/shared/models/entity/abstract/entityValidationError";
import PermissionEntity from "../permission/permissionEntity";
import PermissionsCollection from "../permission/permissionsCollection";
import EntityV2 from "cipherguard-styleguide/src/shared/models/entity/abstract/entityV2";
import UserEntity from "../user/userEntity";

const ENTITY_NAME = 'Folder';
const FOLDER_NAME_MIN_LENGTH = 1;
const FOLDER_NAME_MAX_LENGTH = 256;

class FolderEntity extends EntityV2 {
  /**
   * @inheritDoc
   * Note: Sanitize, if not provided, the DTO folder parent id should be null.
   * @throws {EntityValidationError} Build Rule: Verify that the permission is designated for a folder, and its
   * associated aco foreign key corresponds with the folder ID.
   * @throws {EntityValidationError} Build Rule: Verify that the permissions are designated for a folder, and their
   * associated aco foreign keys correspond with the folder ID.
   */
  constructor(dto, options = {}) {
    super(dto, options);

    // Associations
    if (this._props.permission) {
      this._permission = new PermissionEntity(this._props.permission, {clone: false});
      FolderEntity.assertValidPermission(this._permission, this.id);
      delete this._props.permission;
    }
    if (this._props.permissions) {
      this._permissions = new PermissionsCollection(this._props.permissions, {clone: false});
      FolderEntity.assertValidPermissions(this._permissions, this.id);
      delete this._props.permissions;
    }
    if (this._props.creator) {
      this._creator = new UserEntity(this._props.creator, {...options, clone: false});
      delete this._props._creator;
    }
    if (this._props.modifier) {
      this._modifier = new UserEntity(this._props.modifier, {...options, clone: false});
      delete this._props._modifier;
    }
  }

  /**
   * @inheritdoc
   */
  marshall() {
    // if no parent id specified set it to null
    if (!Object.prototype.hasOwnProperty.call(this._props, 'folder_parent_id')) {
      this._props.folder_parent_id = null;
    }
    super.marshall();
  }

  /**
   * Get folder entity schema
   * @returns {Object} schema
   */
  static getSchema() {
    const userSchema = UserEntity.getSchema();
    return {
      "type": "object",
      "required": [
        "name"
      ],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "folder_parent_id": {
          "type": "string",
          "format": "uuid",
          "nullable": true,
        },
        "name": {
          "type": "string",
          "minLength": FOLDER_NAME_MIN_LENGTH,
          "maxLength": FOLDER_NAME_MAX_LENGTH
        },
        "created_by": {
          "type": "string",
          "format": "uuid"
        },
        "modified_by": {
          "type": "string",
          "format": "uuid"
        },
        "created": {
          "type": "string",
          "format": "date-time"
        },
        "modified": {
          "type": "string",
          "format": "date-time"
        },
        "personal": {
          "type": "boolean",
          "nullable": true,
        },
        "permission": PermissionEntity.getSchema(), // current user permission
        "permissions": PermissionsCollection.getSchema(), // all users permissions
        "creator": userSchema,
        "modifier": userSchema
      }
    };
  }

  /*
   * ==================================================
   * Serialization
   * ==================================================
   */
  /**
   * Return a DTO ready to be sent to API
   *
   * @param {object} [contain] optional
   * @returns {object}
   */
  toDto(contain) {
    const result = Object.assign({}, this._props);
    if (!contain) {
      return result;
    }
    if (this._permission && contain.permission) {
      // TODO More granular permission.group permission.user.avatar
      result.permission = this._permission.toDto(PermissionEntity.ALL_CONTAIN_OPTIONS);
    }
    if (this._permissions && contain.permissions) {
      // TODO More granular permissions.group permissions.user
      result.permissions = this._permissions.toDto(PermissionEntity.ALL_CONTAIN_OPTIONS);
    }
    if (this._creator && contain.creator) {
      result.creator = this._creator.toDto(UserEntity.ALL_CONTAIN_OPTIONS);
    }
    if (this._modifier && contain.modifier) {
      result.modifier = this._modifier.toDto(UserEntity.ALL_CONTAIN_OPTIONS);
    }
    return result;
  }

  /**
   * Customizes JSON stringification behavior
   * @returns {*}
   */
  toJSON() {
    return this.toDto(FolderEntity.ALL_CONTAIN_OPTIONS);
  }

  /*
   * ==================================================
   * Dynamic properties getters
   * ==================================================
   */
  /**
   * Get folder id
   * @returns {(string|null)} uuid
   */
  get id() {
    return this._props.id || null;
  }

  /**
   * Get folder name
   * @returns {string} admin or user
   */
  get name() {
    return this._props.name;
  }

  /**
   * Get folder parent id
   * @returns {(string|null)} uuid parent folder
   */
  get folderParentId() {
    return this._props.folder_parent_id || null;
  }

  /**
   * Get created date
   * @returns {(string|null)} date
   */
  get created() {
    return this._props.created || null;
  }

  /**
   * Get modified date
   * @returns {(string|null)} date
   */
  get modified() {
    return this._props.modified || null;
  }

  /*
   * ==================================================
   * Associated properties methods
   * ==================================================
   */
  /**
   * Get all the current user permissions
   * @returns {{PermissionEntity|null}} permission
   */
  get permission() {
    return this._permission || null;
  }

  /**
   * Get all users permissions for the given folder
   * @returns {{PermissionsCollection|null}} permissions
   */
  get permissions() {
    return this._permissions || null;
  }

  /**
   * Return true if permission is set to owner
   * @returns {boolean}
   */
  isOwner() {
    if (this.permission === null) {
      return false;
    }
    return this.permission.type === PermissionEntity.PERMISSION_OWNER;
  }

  /**
   * Return true if user can update
   * @returns {boolean}
   */
  canUpdate() {
    if (!this.permission || !this.permission.type) {
      return false;
    }
    return this.permission.type >= PermissionEntity.PERMISSION_UPDATE;
  }

  /**
   * Return true if permission is set to read
   * @returns {boolean}
   */
  isReadOnly() {
    if (this.permission === null) {
      return false;
    }
    return this.permission.type === PermissionEntity.PERMISSION_READ;
  }

  /**
   * Get is personal flag
   * @returns {(boolean|null)}
   */
  isPersonal() {
    if (Object.prototype.hasOwnProperty.call(this._props, 'personal')) {
      return this._props.personal;
    }
    if (this.permissions) {
      return this.permissions.length === 1;
    }
    return null;
  }

  /**
   * Get is shared flag
   * @returns {(boolean|null)}
   */
  isShared() {
    if (this.isPersonal() === null) {
      return null;
    }
    return !this.isPersonal();
  }

  /**
   * Additional permission validation rule
   * Check that the permission is for a folder
   * Check that id match foreignKey if any
   *
   * @param {PermissionEntity} permission
   * @param {string} [folderId] optional
   * @throws {EntityValidationError} if not valid
   */
  static assertValidPermission(permission, folderId) {
    if (!permission) {
      throw new EntityValidationError('FolderEntity assertValidPermission expect a permission.');
    }
    if (permission.aco !== PermissionEntity.ACO_FOLDER) {
      throw new EntityValidationError('FolderEntity assertValidPermission not a valid folder permission.');
    }
    if (folderId && permission.acoForeignKey !== folderId) {
      throw new EntityValidationError('FolderEntity assertValidPermission folder id doesnt not match foreign key permission.');
    }
  }

  /**
   * Additional permissions validation rule
   *
   * @param {PermissionsCollection} permissions
   * @param {string} [folderId] optional
   * @throws {EntityValidationError} if not valid
   */
  static assertValidPermissions(permissions, folderId) {
    if (!permissions || !permissions.length) {
      throw new EntityValidationError('FolderEntity assertValidPermissions expect an array of permissions.');
    }
    for (const permission of permissions) {
      FolderEntity.assertValidPermission(permission, folderId);
    }
  }

  /**
   * Assert a given folder can be moved
   * @param {FolderEntity} folderToMove
   * @param {FolderEntity} parentFolder
   * @param {(FolderEntity|null)} destinationFolder
   * @returns {boolean}
   */
  static canFolderMove(folderToMove, parentFolder, destinationFolder) {
    if (folderToMove.isReadOnly()) {
      return ((parentFolder === null || parentFolder.isPersonal()) &&
         (destinationFolder === null || destinationFolder.isPersonal()));
    }
    return (destinationFolder === null || !destinationFolder.isReadOnly());
  }

  /*
   * ==================================================
   * Default properties setters
   * ==================================================
   */
  /**
   * Folder Parent Id
   * @param {string|null} folderParentId optional
   * @throws {EntityValidationError} if parent id is not a valid uuid
   */
  set folderParentId(folderParentId) {
    const propName = 'folder_parent_id';
    if (!folderParentId) {
      this._props[propName] = null;
      return;
    }
    const propSchema = FolderEntity.getSchema().properties[propName];
    this._props[propName] = EntitySchema.validateProp(propName, folderParentId, propSchema);
  }

  /*
   * ==================================================
   * Static properties getters
   * ==================================================
   */
  /**
   * FolderEntity.ENTITY_NAME
   * @returns {string}
   */
  static get ENTITY_NAME() {
    return ENTITY_NAME;
  }

  /**
   * FolderEntity.ALL_CONTAIN_OPTIONS
   * @returns {object} all contain options that can be used in toDto()
   */
  static get ALL_CONTAIN_OPTIONS() {
    return {permission: true, permissions: true, creator: true, modifier: true};
  }
}

export default FolderEntity;
