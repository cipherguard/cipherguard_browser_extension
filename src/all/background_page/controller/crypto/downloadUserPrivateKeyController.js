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
 * @since         3.6.0
 */
import Keyring from "../../model/keyring";
import GetPassphraseService from "../../service/passphrase/getPassphraseService";
import i18n from "../../sdk/i18n";
import GpgKeyError from "../../error/GpgKeyError";
import FileService from "../../service/file/fileService";

const PRIVATE_KEY_FILENAME = "cipherguard_private.asc";
const MIME_TYPE_TEXT_PLAIN = "text/plain";

class DownloadUserPrivateKeyController {
  /**
   * DownloadUserPrivateKeyController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   * @param {AccountEntity} account the account associated to the worker
   */
  constructor(worker, requestId, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.keyring = new Keyring();
    this.getPassphraseService = new GetPassphraseService(account);
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @returns {Promise<void>}
   */
  async _exec() {
    try {
      await this.exec();
      this.worker.port.emit(this.requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Offer to users to download their private key
   *
   * @returns {Promise<void>}
   */
  async exec() {
    await this.getPassphraseService.requestPassphrase(this.worker);
    let privateKey;
    try {
      privateKey = this.keyring.findPrivate().armoredKey;
    } catch (e) {
      throw new GpgKeyError(i18n.t("Private key not found."));
    }

    await FileService.saveFile(PRIVATE_KEY_FILENAME, privateKey, MIME_TYPE_TEXT_PLAIN, this.worker.tab.id);
  }
}

export default DownloadUserPrivateKeyController;
