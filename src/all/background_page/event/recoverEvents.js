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
 * @since         2.0.0
 */

import GetKeyInfoController from "../controller/crypto/getKeyInfoController";
import RequestAccountRecoveryController from "../controller/recover/requestAccountRecoveryController";
import GenerateRecoverAccountRecoveryRequestKeyController from "../controller/recover/generateRecoverAccountRecoveryRequestKeyController";
import VerifyImportedKeyPassphraseController from "../controller/setup/verifyImportedKeyPassphraseController";
import ImportRecoverPrivateKeyController from "../controller/recover/importRecoverPrivateKeyController";
import StartRecoverController from "../controller/recover/startRecoverController";
import CompleteRecoverController from "../controller/recover/completeRecoverController";
import ValidatePrivateGpgKeyRecoverController from "../controller/crypto/validatePrivateGpgKeyRecoverController";
import AbortAndRequestHelp from "../controller/recover/abortAndRequestHelpController";
import SignInSetupController from "../controller/setup/signInSetupController";
import SetSetupLocaleController from "../controller/setup/setSetupLocaleController";
import GetOrganizationSettingsController from "../controller/organizationSettings/getOrganizationSettingsController";
import GetAndInitializeAccountLocaleController from "../controller/account/getAndInitializeAccountLocaleController";
import IsExtensionFirstInstallController from "../controller/extension/isExtensionFirstInstallController";
import IsLostPassphraseCaseController from "../controller/accountRecovery/isLostPassphraseCaseController";
import SetSetupSecurityTokenController from "../controller/setup/setSetupSecurityTokenController";
import HasRecoverUserEnabledAccountRecoveryController from "../controller/recover/hasRecoverUserEnabledAccountRecoveryController";
import GetUserPassphrasePoliciesController from "../controller/setup/getUserPassphrasePoliciesController";
import ReloadTabController from "../controller/tab/reloadTabController";


const listen = (worker, apiClientOptions, account) => {
  worker.port.on('cipherguard.recover.first-install', async requestId => {
    const controller = new IsExtensionFirstInstallController(worker, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.recover.lost-passphrase-case', async requestId => {
    const controller = new IsLostPassphraseCaseController(worker, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.organization-settings.get', async requestId => {
    const controller = new GetOrganizationSettingsController(worker, requestId, apiClientOptions);
    await controller._exec();
  });

  worker.port.on('cipherguard.recover.start', async requestId => {
    const controller = new StartRecoverController(worker, requestId, apiClientOptions, account);
    await controller._exec();
  });

  worker.port.on('cipherguard.locale.get', async requestId => {
    const controller = new GetAndInitializeAccountLocaleController(worker, requestId, apiClientOptions, account);
    await controller._exec();
  });

  worker.port.on('cipherguard.locale.update-user-locale', async(requestId, localeDto) => {
    const controller = new SetSetupLocaleController(worker, requestId, apiClientOptions, account);
    await controller._exec(localeDto);
  });

  worker.port.on('cipherguard.recover.has-user-enabled-account-recovery', async requestId => {
    const controller = new HasRecoverUserEnabledAccountRecoveryController(worker, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.recover.import-key', async(requestId, armoredKey) => {
    const controller = new ImportRecoverPrivateKeyController(worker, requestId, apiClientOptions);
    await controller._exec(armoredKey);
  });

  worker.port.on('cipherguard.recover.verify-passphrase', async(requestId, passphrase) => {
    const controller = new VerifyImportedKeyPassphraseController(worker, requestId);
    await controller._exec(passphrase);
  });

  worker.port.on('cipherguard.recover.set-security-token', async(requestId, securityTokenDto) => {
    const controller = new SetSetupSecurityTokenController(worker, requestId);
    await controller._exec(securityTokenDto);
  });

  worker.port.on('cipherguard.recover.complete', async requestId => {
    const controller = new CompleteRecoverController(worker, requestId, apiClientOptions);
    await controller._exec();
  });

  worker.port.on('cipherguard.recover.sign-in', async(requestId, rememberMe) => {
    const controller = new SignInSetupController(worker, requestId, apiClientOptions);
    await controller._exec(rememberMe);
  });

  worker.port.on('cipherguard.recover.generate-account-recovery-request-key', async(requestId, generateGpgKeyPairDto) => {
    const controller = new GenerateRecoverAccountRecoveryRequestKeyController(worker, requestId, apiClientOptions);
    await controller._exec(generateGpgKeyPairDto);
  });

  worker.port.on('cipherguard.recover.initiate-account-recovery-request', async requestId => {
    const controller = new RequestAccountRecoveryController(worker, apiClientOptions, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.keyring.get-key-info', async(requestId, armoredKey) => {
    const controller = new GetKeyInfoController(worker, requestId);
    await controller._exec(armoredKey);
  });

  worker.port.on('cipherguard.recover.validate-private-key', async(requestId, key) => {
    const controller = new ValidatePrivateGpgKeyRecoverController(worker, requestId);
    await controller._exec(key);
  });

  worker.port.on('cipherguard.recover.request-help-credentials-lost', async requestId => {
    const controller = new AbortAndRequestHelp(worker, requestId, apiClientOptions);
    await controller._exec();
  });

  worker.port.on('cipherguard.recover.get-user-passphrase-policies', async requestId => {
    const controller = new GetUserPassphrasePoliciesController(worker, requestId);
    await controller._exec();
  });

  worker.port.on('cipherguard.tab.reload', async requestId => {
    const controller = new ReloadTabController(worker, requestId);
    await controller._exec();
  });
};
export const RecoverEvents = {listen};
