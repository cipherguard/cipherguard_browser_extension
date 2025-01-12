/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.2.0
 */

import LocaleModel from "../../model/locale/localeModel";
import AccountTemporarySessionStorageService from "../../service/sessionStorage/accountTemporarySessionStorageService";

class SetSetupLocaleController {
  /**
   * Constructor.
   * @param {Worker} worker The worker the controller is executed on.
   * @param {string} requestId The associated request id.
   * @param {ApiClientOptions} apiClientOptions The api client options.
   * @param {AccountSetupEntity} account The account being setup.
   */
  constructor(worker, requestId, apiClientOptions, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.localeModel = new LocaleModel(apiClientOptions);
    this.account = account;
  }

  /**
   * Controller executor.
   * @params {Object} localeDto The locale dto.
   * @returns {Promise<void>}
   */
  async _exec(localeDto) {
    try {
      const result = await this.exec(localeDto);
      this.worker.port.emit(this.requestId, 'SUCCESS', result);
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Set the locale of the user in the setup workflow.
   * @params {Object} localeDto The locale dto.
   * @returns {Promise<void>} The locale
   * @throw {EntityValidationError} if the locale is not supported.
   */
  async exec(localeDto) {
    const locale = await this.localeModel.getSupportedLocale(localeDto.locale);
    if (!locale) {
      throw new Error('Unsupported locale.');
    }
    // Update the temporary account locale, don't need to check the worker.
    const temporaryAccount = await AccountTemporarySessionStorageService.get(this.worker.port._port.name);
    if (temporaryAccount) {
      temporaryAccount.account.locale = locale.locale;
      await AccountTemporarySessionStorageService.set(temporaryAccount);
    }
    this.account.locale = locale.locale;
    await this.localeModel.initializeI18next(locale);
  }
}

export default SetSetupLocaleController;
