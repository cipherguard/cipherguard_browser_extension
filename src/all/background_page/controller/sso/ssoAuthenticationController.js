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
 * @since         3.9.0
 */
import SsoDataStorage from "../../service/indexedDB_storage/ssoDataStorage";
import DecryptSsoPassphraseService from "../../service/crypto/decryptSsoPassphraseService";
import PopupHandlerService from "../../service/sso/popupHandlerService";
import SsoKitServerPartModel from "../../model/sso/ssoKitServerPartModel";
import {QuickAccessService} from "../../service/ui/quickAccess.service";
import SsoLoginModel from "../../model/sso/ssoLoginModel";
import SsoSettingsModel from "../../model/sso/ssoSettingsModel";
import SsoSettingsChangedError from "../../error/ssoSettingsChangedError";
import QualifySsoLoginErrorService from "../../service/sso/qualifySsoLoginErrorService";
import AuthVerifyLoginChallengeService from "../../service/auth/authVerifyLoginChallengeService";
import PassphraseStorageService from "../../service/session_storage/passphraseStorageService";
import PostLoginService from "../../service/auth/postLoginService";
import KeepSessionAliveService from "../../service/session_storage/keepSessionAliveService";
import PromiseTimeoutService from "../../utils/promise/promiseTimeoutService";
import BrowserTabService from "../../service/ui/browserTab.service";

class SsoAuthenticationController {
  /**
   * SsoAuthenticationController constructor
   * @param {Worker} worker
   * @param {string} requestId uuid
   * @param {ApiClientOptions} apiClientOptions the api client options
   * @param {AccountEntity} account The user account
   */
  constructor(worker, requestId, apiClientOptions, account) {
    this.worker = worker;
    this.requestId = requestId;
    this.account = account;
    this.ssoKitServerPartModel = new SsoKitServerPartModel(apiClientOptions);
    this.ssoLoginModel = new SsoLoginModel(apiClientOptions);
    this.popupHandler = new PopupHandlerService(account.domain, worker?.tab?.id, false);
    this.authVerifyLoginChallengeService = new AuthVerifyLoginChallengeService(apiClientOptions);
    this.ssoSettingsModel = new SsoSettingsModel(apiClientOptions);
  }

  /**
   * Wrapper of exec function to run it with worker.
   *
   * @param {boolean} isInQuickAccessMode true if the controller has been called from the quickaccess
   * @return {Promise<void>}
   */
  async _exec(providerId, isInQuickAccessMode = false) {
    try {
      await this.exec(providerId, isInQuickAccessMode);
      this.worker.port.emit(this.requestId, "SUCCESS");
    } catch (error) {
      console.error(error);
      this.worker.port.emit(this.requestId, "ERROR", error);
    }
  }

  /**
   * Authenticate the user using a third-party SSO provider.
   *
   * @param {boolean} isInQuickAccessMode true if the controller has been called from the quickaccess
   * @return {Promise<void>}
   */
  async exec(providerId, isInQuickAccessMode) {
    const clientPartSsoKit = await SsoDataStorage.get();
    if (!clientPartSsoKit) {
      throw new Error("The Single Sign-On cannot proceed as there is no SSO kit registered on this browser profile.");
    }
    const userId = this.account.userId;

    let loginUrl;
    try {
      loginUrl = await this.ssoLoginModel.getLoginUrl(providerId, userId);
    } catch (e) {
      const qualifiedError = await this.qualifyGetLoginUrlError(e, isInQuickAccessMode);
      throw qualifiedError;
    }

    try {
      const thirdPartyCode = await this.popupHandler.getSsoTokenFromThirdParty(loginUrl);
      const ssoServerData = await this.ssoKitServerPartModel.getSsoKit(clientPartSsoKit.id, userId, thirdPartyCode);

      const serverKey = await crypto.subtle.importKey("jwk", ssoServerData.key, 'AES-GCM', true, ["encrypt", "decrypt"]);

      const passphrase = await DecryptSsoPassphraseService.decrypt(clientPartSsoKit.secret, clientPartSsoKit.nek, serverKey, clientPartSsoKit.iv1, clientPartSsoKit.iv2);
      await this.popupHandler.closeHandler();
      await this.authVerifyLoginChallengeService.verifyAndValidateLoginChallenge(this.account.userKeyFingerprint, this.account.userPrivateArmoredKey, passphrase);
      await Promise.all([
        PassphraseStorageService.set(passphrase, -1),
        KeepSessionAliveService.start(),
      ]);
      await PostLoginService.exec();
      if (isInQuickAccessMode) {
        await this.ensureRedirectionInQuickaccessMode();
      }
    } catch (error) {
      console.error("An error occured while attempting sign in with a third party provider:", error);
      this.handleSpecificErrors(error);
      throw error;
    }
  }

  /**
   * Opens the quickacces in detached mode to ensure the redirection after login is made.
   * Calling this is only done when signin-in with SSO via the quickaccess.
   * The reason is to avoid a problem where closing the SSO popup actually closes the quickaccess,
   * as a consequence, the port is disconnected as well.
   * What could happen is that the port is disconnected before the `_exec` returns the "SUCCESS" and
   * the login process stops from the styleguide point of view, makinng it broken somehow
   * the login wouldn't redirect to ressource workspace neither redirect to MFA if required.
   * @returns {Promise<void>}
   */
  async ensureRedirectionInQuickaccessMode() {
    try {
      await PromiseTimeoutService.exec(this.worker.port.request('cipherguard.port.check'));
      return;
    } catch (error) {
      console.debug("The port from the quickaccess is not connected anymore");
      console.error(error);
    }

    // Get the current tab to add in the property of the detach quickaccess
    const tab = await BrowserTabService.getCurrent();
    const queryParameters = [
      {name: "uiMode", value: "detached"},
      {name: "feature", value: "login"},
      {name: "tabId", value: tab.id}
    ];
    await QuickAccessService.openInDetachedMode(queryParameters);
  }

  /**
   * Handles error of different type coming from the SSO authentication process
   * @param {Error} error
   */
  handleSpecificErrors(error) {
    switch (error.name) {
      case 'InvalidMasterPasswordError':
      case 'OutdatedSsoKitError': {
        SsoDataStorage.flush();
        break;
      }
      case 'CipherguardApiFetchError': {
        const isCsrfTokenError = error?.data?.code === 403;
        if (!isCsrfTokenError) {
          SsoDataStorage.flush();
        }
      }
    }
  }

  /**
   * Qualifies an error happened during the fetching of the SSO provider login URL.
   * An error happens if the SSO provider has changed since last login or if SSO is disabled
   * @param {Error} e the error to qualify
   * @param {boolean} isInQuickAccessMode
   * @returns {Promise<Error>}
   */
  async qualifyGetLoginUrlError(e, isInQuickAccessMode) {
    if (e.data.code !== 400) {
      return e; //it's an unexpected state that shouldn't be handle here
    }

    if (isInQuickAccessMode) {
      const url = `${this.account.domain}/auth/login?case=sso-login-error`;
      await browser.tabs.create({url: url, active: true});
      return new SsoSettingsChangedError("The quickaccess cannot proceed with the SSO login.");
    }

    const configuration = await this.ssoSettingsModel.getCurrent();
    return QualifySsoLoginErrorService.qualifyErrorFromConfiguration(configuration);
  }
}

export default SsoAuthenticationController;
