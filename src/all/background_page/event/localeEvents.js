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
 * @since         3.2.0
 */
import LocaleModel from "../model/locale/localeModel";
import GetLocaleController from "../controller/locale/getLocaleController";
import LocaleEntity from "../model/entity/locale/localeEntity";

/**
 * Listens to the locale events
 * @param {Worker} worker
 * @param {ApiClientOptions} apiClientOptions the api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * Get locale language
   *
   * @listens cipherguard.locale.get
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.locale.get', async requestId => {
    const getLocaleController = new GetLocaleController(worker, apiClientOptions);

    try {
      const localeEntity = await getLocaleController.getLocale();
      worker.port.emit(requestId, 'SUCCESS', localeEntity);
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, 'ERROR', error);
    }
  });

  /*
   * Update the locale language
   *
   * @listens cipherguard.locale.language.update
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.locale.update-user-locale', async(requestId, localeDto) => {
    const localeModel = new LocaleModel(apiClientOptions);
    try {
      const localeToUpdateEntity = new LocaleEntity(localeDto);
      await localeModel.updateUserLocale(localeToUpdateEntity);
      worker.port.emit(requestId, 'SUCCESS');
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};

export const LocaleEvents = {listen};
