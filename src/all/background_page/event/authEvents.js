/**
 * Auth events.
 *
 * Used to handle the events related to authentication.
 *
 * @copyright (c) 2019 Cipherguard SA
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
import AuthVerifyServerKeyController from "../controller/auth/authVerifyServerKeyController";
import AuthCheckStatusController from "../controller/auth/authCheckStatusController";
import AuthIsMfaRequiredController from "../controller/auth/authIsMfaRequiredController";
import CheckPassphraseController from "../controller/crypto/checkPassphraseController";
import RequestHelpCredentialsLostController from "../controller/auth/requestHelpCredentialsLostController";
import AuthLoginController from "../controller/auth/authLoginController";
import GetLocalSsoProviderConfiguredController from "../controller/sso/getLocalSsoProviderConfiguredController";
import SsoAuthenticationController from "../controller/sso/ssoAuthenticationController";
import DeleteLocalSsoKitController from "../controller/sso/deleteLocalSsoKitController";
import UpdateLocalSsoProviderController from "../controller/sso/updateLocalSsoProviderController";
import HasSsoLoginErrorController from "../controller/sso/hasSsoLoginErrorController";
import GetQualifiedSsoLoginErrorController from "../controller/sso/getQualifiedSsoLoginErrorController";
import AuthLogoutController from "../controller/auth/authLogoutController";
import GetServerKeyController from "../controller/auth/getServerKeyController";
import ReplaceServerKeyController from "../controller/auth/replaceServerKeyController";
import ReloadTabController from "../controller/tab/reloadTabController";

/**
 * Listens to the authentication events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 * @param {AccountEntity} account The account
 */
const listen = function(worker, apiClientOptions, account) {
  /*
   * Check if the user requires to complete the mfa.
   *
   * @listens cipherguard.auth.is-mfa-required
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.is-mfa-required', async requestId => {
    const controller = new AuthIsMfaRequiredController(worker, requestId);
    controller._exec();
  });

  /*
   * Check the user auth status.
   *
   * @listens cipherguard.auth.check-status
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.check-status', async requestId => {
    const controller = new AuthCheckStatusController(worker, requestId);
    controller._exec();
  });

  /*
   * Logout.
   *
   * @listens cipherguard.auth.logout
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.logout', async(requestId, withRedirection) => {
    const controller = new AuthLogoutController(worker, requestId, apiClientOptions);
    await controller._exec(withRedirection);
  });

  /*
   * Verify the server identity.
   *
   * @listens cipherguard.auth.verify
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.verify-server-key', async requestId => {
    const auth = new AuthVerifyServerKeyController(worker, requestId, apiClientOptions, account);
    await auth._exec();
  });

  /*
   * Get the password server key for a given domain.
   *
   * @listens cipherguard.auth.get-server-key
   * @param requestId {uuid} The request identifier
   * @param domain {string} The server's domain
   */
  worker.port.on('cipherguard.auth.get-server-key', async requestId => {
    const getServerKeyController = new GetServerKeyController(worker, requestId, apiClientOptions);
    await getServerKeyController._exec();
  });

  /*
   * Get the password server key for a given domain.
   *
   * @listens cipherguard.auth.replace-server-key
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.replace-server-key', async requestId => {
    const replaceServerKeyController = new ReplaceServerKeyController(worker, requestId, apiClientOptions, account);
    await replaceServerKeyController._exec();
  });

  /*
   * Verify the passphrase
   *
   * @listens cipherguard.auth.verify-passphrase
   * @param requestId {uuid} The request identifier
   * @param passphrase {string} The passphrase to verify
   */
  worker.port.on('cipherguard.auth.verify-passphrase', async(requestId, passphrase) => {
    const controller = new CheckPassphraseController(worker, requestId);
    await controller._exec(passphrase);
  });

  /*
   * Attempt to login the current user.
   *
   * @listens cipherguard.auth.login
   * @param requestId {uuid} The request identifier
   * @param passphrase {string} The passphrase to decryt the private key
   * @param remember {string} whether to remember the passphrase
   *   (bool) false|undefined if should not remember
   */
  worker.port.on('cipherguard.auth.login', async(requestId, passphrase, remember) => {
    const controller = new AuthLoginController(worker, requestId, apiClientOptions, account);
    await controller._exec(passphrase, remember);
  });

  /*
   * Redirect the user post login.
   *
   * @listens cipherguard.auth.post-login-redirect
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.post-login-redirect', requestId => {
    let url = account.domain;
    const redirectTo = (new URL(worker.tab.url)).searchParams.get('redirect');
    if (/^\/[A-Za-z0-9\-\/]*$/.test(redirectTo)) {
      url = `${url}${redirectTo}`;
    }
    chrome.tabs.update(worker.tab.id, {url: url});
    worker.port.emit(requestId, 'SUCCESS');
  });

  /*
   * Request help credentials lost.
   *
   * @listens cipherguard.auth.request-help-credentials-lost
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.auth.request-help-credentials-lost', async requestId => {
    const controller = new RequestHelpCredentialsLostController(worker, requestId, apiClientOptions, account);
    await controller._exec();
  });

  /**
   * Attempt to sign in with the given provider as a third party
   * @listens cipherguard.sso.sign-in
   * @param {uuid} requestId The request identifier
   * @param {uuid} providerId the SSO provider identifier
   * @param {boolean} isInQuickaccessMode is the current call made from the quickaccess
   */
  worker.port.on('cipherguard.sso.sign-in', async(requestId, providerId, isInQuickaccessMode) => {
    const controller = new SsoAuthenticationController(worker, requestId, apiClientOptions, account);
    await controller._exec(providerId, isInQuickaccessMode);
  });

  /**
   * Returns the sso provider id registered client-side.
   * @listens cipherguard.sso.get-local-configured-provider
   * @param {uuid} requestId The request identifier
   */
  worker.port.on('cipherguard.sso.get-local-configured-provider', async requestId => {
    const controller = new GetLocalSsoProviderConfiguredController(worker, requestId);
    await controller._exec();
  });

  /**
   * Deletes the SSO kit stored locally
   * @listens cipherguard.sso.delete-local-kit
   * @param {uuid} requestId The request identifier
   */
  worker.port.on('cipherguard.sso.delete-local-kit', async requestId => {
    const controller = new DeleteLocalSsoKitController(worker, requestId);
    await controller._exec();
  });

  /**
   * Updates the SSO kit stored locally
   * @listens cipherguard.sso.update-provider-local-kit
   * @param {uuid} requestId The request identifier
   * @param {string} ssoProviderId The new provider to set
   */
  worker.port.on('cipherguard.sso.update-provider-local-kit', async(requestId, ssoProviderId) => {
    const controller = new UpdateLocalSsoProviderController(worker, requestId);
    await controller._exec(ssoProviderId);
  });

  /**
   * Checks wether the current tab URL is an SSO login error URL
   * @listens cipherguard.sso.has-sso-login-error
   * @param {uuid} requestId The request identifier
   */
  worker.port.on('cipherguard.sso.has-sso-login-error', async requestId => {
    const controller = new HasSsoLoginErrorController(worker, requestId);
    await controller._exec();
  });

  /**
   * Returns a qualified error based on the local SSO kit configuration and the API configuration
   * @listens cipherguard.sso.get-qualified-sso-login-error
   * @param {uuid} requestId The request identifier
   */
  worker.port.on('cipherguard.sso.get-qualified-sso-login-error', async requestId => {
    const controller = new GetQualifiedSsoLoginErrorController(worker, requestId, apiClientOptions);
    await controller._exec();
  });

  worker.port.on('cipherguard.tab.reload', async requestId => {
    const controller = new ReloadTabController(worker, requestId);
    await controller._exec();
  });
};

export const AuthEvents = {listen};
