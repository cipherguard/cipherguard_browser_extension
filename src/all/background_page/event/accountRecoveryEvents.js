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
import DownloadRecoveryKitController from "../controller/setup/downloadRecoverKitController";
import ContinueAccountRecoveryController from "../controller/accountRecovery/continueAccountRecoveryController";
import RecoverAccountController from "../controller/accountRecovery/recoverAccountController";
import VerifyAccountPassphraseController from "../controller/account/verifyAccountPassphraseController";
import AbortAndInitiateNewAccountRecoveryController from "../controller/accountRecovery/abortAndInitiateNewAccountRecoveryController";
import SetSetupLocaleController from "../controller/setup/setSetupLocaleController";
import GetOrganizationSettingsController from "../controller/organizationSettings/getOrganizationSettingsController";
import GetAndInitializeAccountLocaleController from "../controller/account/getAndInitializeAccountLocaleController";
import GetExtensionVersionController from "../controller/extension/getExtensionVersionController";
import GetAccountController from "../controller/account/getAccountController";
import AccountRecoveryLoginController from "../controller/accountRecovery/accountRecoveryLoginController";
import ReloadTabController from "../controller/tab/reloadTabController";

/**
 * Listens to the account recovery continue application events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 * @param {AccountAccountRecoveryEntity} account The account completing the account recovery
 */
const listen = function(worker, apiClientOptions, account) {
  worker.port.on('cipherguard.organization-settings.get', async requestId => {
    const controller = new GetOrganizationSettingsController(worker, requestId, apiClientOptions);
    await controller._exec();
  });

  worker.port.on('cipherguard.locale.get', async requestId =>  {
    const controller = new GetAndInitializeAccountLocaleController(worker, requestId, apiClientOptions, account);
    await controller._exec();
  });

  worker.port.on('cipherguard.addon.get-version', async requestId => {
    const controller = new GetExtensionVersionController(worker, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.account-recovery.continue', async requestId => {
    const controller = new ContinueAccountRecoveryController(worker, requestId, apiClientOptions, account);
    await controller._exec();
  });

  worker.port.on('cipherguard.account-recovery.get-account', async requestId => {
    const controller = new GetAccountController(worker, requestId, account);
    await controller._exec();
  });

  worker.port.on('cipherguard.account-recovery.verify-passphrase', async(requestId, passphrase) => {
    const controller = new VerifyAccountPassphraseController(worker, requestId, account);
    await controller._exec(passphrase);
  });

  worker.port.on('cipherguard.account-recovery.recover-account', async(requestId, passphrase) => {
    const controller = new RecoverAccountController(worker, requestId, apiClientOptions);
    await controller._exec(passphrase);
  });

  worker.port.on('cipherguard.account-recovery.sign-in', async(requestId, passphrase, rememberMe) => {
    const controller = new AccountRecoveryLoginController(worker, requestId, apiClientOptions, account);
    await controller._exec(passphrase, rememberMe);
  });

  worker.port.on('cipherguard.account-recovery.request-help-credentials-lost', async requestId => {
    const controller = new AbortAndInitiateNewAccountRecoveryController(worker, requestId, apiClientOptions, account);
    await controller._exec();
  });

  worker.port.on('cipherguard.account-recovery.download-recovery-kit', async requestId => {
    const controller = new DownloadRecoveryKitController(worker, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.locale.update-user-locale', async(requestId, localeDto) => {
    const controller = new SetSetupLocaleController(worker, requestId, apiClientOptions, account);
    await controller._exec(localeDto);
  });

  worker.port.on('cipherguard.tab.reload', async requestId => {
    const controller = new ReloadTabController(worker, requestId);
    await controller._exec();
  });
};

export const AccountRecoveryEvents = {listen};
