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

import {OpenpgpAssertion} from "../../utils/openpgp/openpgpAssertions";
import DecryptMessageService from "../../service/crypto/decryptMessageService";
import AccountRecoveryModel from "../../model/accountRecovery/accountRecoveryModel";
import DecryptPrivateKeyService from "../../service/crypto/decryptPrivateKeyService";
import EncryptPrivateKeyService from "../../service/crypto/encryptPrivateKeyService";
import AccountModel from "../../model/account/accountModel";
import SetupModel from "../../model/setup/setupModel";
import DecryptResponseDataService from "../../service/accountRecovery/decryptResponseDataService";
import AccountAccountRecoveryEntity from "../../model/entity/account/accountAccountRecoveryEntity";
import AccountEntity from "../../model/entity/account/accountEntity";
import UpdateSsoCredentialsService from "../../service/account/updateSsoCredentialsService";
import SsoDataStorage from "../../service/indexedDB_storage/ssoDataStorage";
import AccountTemporarySessionStorageService from "../../service/sessionStorage/accountTemporarySessionStorageService";
import FindAccountTemporaryService from "../../service/account/findAccountTemporaryService";

class RecoverAccountController {
  /**
   * Constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   * @param {ApiClientOptions} apiClientOptions
   */
  constructor(worker, requestId, apiClientOptions) {
    this.worker = worker;
    this.requestId = requestId;
    this.accountRecoveryModel = new AccountRecoveryModel(apiClientOptions);
    this.setupModel = new SetupModel(apiClientOptions);
    this.accountModel = new AccountModel(apiClientOptions);
    this.updateSsoCredentialsService = new UpdateSsoCredentialsService(apiClientOptions);
    // The temporary account stored in the session storage
    this.temporaryAccount = null;
  }

  /**
   * Wrapper of exec function to run it with worker.
   * @return {Promise<*>}
   */
  async _exec() {
    try {
      await this.exec.apply(this, arguments);
      this.worker.port.emit(this.requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, 'ERROR', error);
    }
  }

  /**
   * Check the user temporary account recovery gpg key passphrase.
   *
   * @param {string} passphrase The passphrase to verify
   * @return {Promise<void>}
   */
  async exec(passphrase) {
    this.temporaryAccount = await FindAccountTemporaryService.exec(this.worker.port._port.name);
    if (typeof passphrase === "undefined") {
      throw new Error("A passphrase is required.");
    }
    if (typeof passphrase !== "string") {
      throw new Error("The passphrase should be a string.");
    }

    const request = await this._findAndAssertRequest(this.temporaryAccount.account);
    const recoveredArmoredPrivateKey = await this._recoverPrivateKey(request.accountRecoveryPrivateKey, request.accountRecoveryResponses.items[0], passphrase);
    await this._completeRecover(recoveredArmoredPrivateKey);
    const account = await this._addRecoveredAccountToStorage(this.temporaryAccount.account);
    this._updateWorkerAccount(account);
    await this._refreshSsoKit(passphrase);
    // Update all data in the temporary account stored
    await AccountTemporarySessionStorageService.set(this.temporaryAccount);
  }

  /**
   * Find the account recovery request.
   * @param {AccountAccountRecoveryEntity} account The account
   * @return {Promise<AccountRecoveryRequestEntity>}
   * @throw {Error} If the request id does not match the request id associated to the account recovery material stored on the extension
   * @throw {Error} If the request does not have a private key defined
   * @throw {Error} If the request does not have a collection of responses defined
   * @throw {Error} If the request responses is empty
   * @private
   */
  async _findAndAssertRequest(account) {
    const accountRecoveryRequest = await this.accountRecoveryModel.findRequestByIdAndUserIdAndAuthenticationToken(
      account.accountRecoveryRequestId,
      account.userId,
      account.authenticationTokenToken
    );

    if (accountRecoveryRequest.id !== account.accountRecoveryRequestId) {
      throw new Error("The account recovery request id should match the request id associated to the account being recovered.");
    }

    if (!accountRecoveryRequest.accountRecoveryPrivateKey) {
      throw new Error("The account recovery request should have a private key.");
    }

    if (!accountRecoveryRequest.accountRecoveryResponses) {
      throw new Error("The account recovery request should have a collection of responses.");
    }

    if (accountRecoveryRequest.accountRecoveryResponses.length !== 1) {
      throw new Error("The account recovery request responses should contain exactly one response.");
    }

    return accountRecoveryRequest;
  }

  /**
   * Recover the user private key.
   * @param {AccountRecoveryPrivateKeyEntity} privateKey The account recovery private key to recover.
   * @param {AccountRecoveryResponseEntity} response The account recovery response.
   * @param {string} passphrase The account recovery request user private key passphrase and recovered private key new passphrase.
   * @return {Promise<openpgp.PrivateKey>} The recovered private armored key.
   * @private
   */
  async _recoverPrivateKey(privateKey, response, passphrase) {
    const key = await OpenpgpAssertion.readKeyOrFail(this.temporaryAccount.account.userPrivateArmoredKey);
    const requestPrivateKeyDecrypted = await DecryptPrivateKeyService.decrypt(key, passphrase);
    /*
     * @todo Additional check could be done to ensure the recovered key is the same than the one the user was previously using.
     *   If the user is in the case lost passphrase, a key should still be referenced in the storage of the extension.
     */
    const privateKeyPasswordDecryptedData = await DecryptResponseDataService.decrypt(response, requestPrivateKeyDecrypted, this.temporaryAccount.account.userId, this.temporaryAccount.account.domain);
    const privateKeyData = await OpenpgpAssertion.readMessageOrFail(privateKey.data);
    const decryptedRecoveredPrivateArmoredKey = await DecryptMessageService.decryptSymmetrically(privateKeyData, privateKeyPasswordDecryptedData.privateKeySecret);
    const decryptedRecoveredPrivateKey = await OpenpgpAssertion.readKeyOrFail(decryptedRecoveredPrivateArmoredKey);
    return EncryptPrivateKeyService.encrypt(decryptedRecoveredPrivateKey, passphrase);
  }

  /**
   * Complete the recover.
   * @param {openpgp.PrivateKey} recoveredPrivateKey The recovered private key
   * @return {Promise<void>}
   * @private
   */
  async _completeRecover(recoveredPrivateKey) {
    OpenpgpAssertion.assertPrivateKey(recoveredPrivateKey);
    this.temporaryAccount.account.userPrivateArmoredKey = recoveredPrivateKey.armor();
    this.temporaryAccount.account.userPublicArmoredKey = recoveredPrivateKey.toPublic().armor();
    this.temporaryAccount.account.userKeyFingerprint = recoveredPrivateKey.getFingerprint().toUpperCase();
    await this.setupModel.completeRecover(this.temporaryAccount.account);
  }

  /**
   * Add account to local storage.
   * @param {AccountAccountRecoveryEntity} accountAccountRecovery The recovered account.
   * @return {Promise<AccountEntity>}
   * @private
   */
  async _addRecoveredAccountToStorage(accountAccountRecovery) {
    const account = new AccountEntity(accountAccountRecovery.toDto(AccountAccountRecoveryEntity.ALL_CONTAIN_OPTIONS));
    await this.accountModel.add(account);
    return account;
  }

  /**
   * Update the worker account with the recovered credentials.
   * @todo This step is necessary to perform a sign-in with the current account/signInController, where it requires the
   *   account associated with the worker to be associated with the user keys. As there is no solution to change the
   *   current worker account, the keys need to be associated to the account recovery account temporarily.
   *
   * @param {AccountEntity} account The recovered account
   * @return {void}
   * @private
   */
  _updateWorkerAccount(account) {
    this.temporaryAccount.account.userPublicArmoredKey = account.userPublicArmoredKey;
    this.temporaryAccount.account.userPrivateArmoredKey = account.userPrivateArmoredKey;
    this.temporaryAccount.account.userKeyFingerprint = account.userKeyFingerprint;
  }

  /**
   * Refresh the local SSO kit by removing it before generating it.
   * @return {Promise<void>}
   * @private
   */
  async _refreshSsoKit(passphrase) {
    /*
     * The storage is first flushed before generating the kit.
     * It's to ensure the refresh of the kit without deleting the server part.
     * The server part is kept as the user needs to be logged in to request a DELETE on the API.
     */
    await SsoDataStorage.flush();
    await this.updateSsoCredentialsService.updateSsoKitIfNeeded(passphrase);
  }
}

export default RecoverAccountController;
