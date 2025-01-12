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
import ThemeModel from "../model/theme/themeModel";
import ChangeThemeEntity from "../model/entity/theme/change/ChangeThemeEntity";

/**
 * Listens the theme events
 * @param {Worker} worker
 * @param {ApiClientOptions} apiClientOptions the api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * Find all themes
   *
   * @listens cipherguard.themes.find-all
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.themes.find-all', async requestId => {
    try {
      const themeModel = new ThemeModel(apiClientOptions);
      const themes = await themeModel.findAll();
      worker.port.emit(requestId, 'SUCCESS', themes);
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, 'ERROR', error);
    }
  });

  /*
   * Change the current user theme
   *
   * @listens cipherguard.themes.change
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.themes.change', async(requestId, name) => {
    try {
      const themeModel = new ThemeModel(apiClientOptions);
      const changeThemeEntity = new ChangeThemeEntity({name: name});
      await themeModel.change(changeThemeEntity);
      worker.port.emit(requestId, 'SUCCESS');
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};

export const ThemeEvents = {listen};
