/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.2.0
 */
import ResourceGridUserSettingLocalStorage from "../../service/local_storage/ressourceGridSettingLocalStorage";
import GridUserSettingEntity from "cipherguard-styleguide/src/shared/models/entity/gridUserSetting/gridUserSettingEntity";

class SetResourceGridUserSettingController {
  /**
   * ColumnsResourcesSettingsController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   * @param {AccountEntity} account The account associated to the worker
   */
  constructor(worker, requestId, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.resourceGridUserSettingLocalStorage = new ResourceGridUserSettingLocalStorage(account);
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @return {Promise<void>}
   */
  async _exec(gridUserSetting) {
    try {
      await this.exec(gridUserSetting);
      this.worker.port.emit(this.requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Set the resource grid setting.
   *
   * @return {Promise<void>}
   */
  async exec(gridUserSetting) {
    const gridUserSettingEntity = new GridUserSettingEntity(gridUserSetting);
    await this.resourceGridUserSettingLocalStorage.set(gridUserSettingEntity);
  }
}

export default SetResourceGridUserSettingController;
