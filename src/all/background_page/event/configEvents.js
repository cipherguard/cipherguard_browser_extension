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

import User from "../model/user";
import GetExtensionVersionController from "../controller/extension/getExtensionVersionController";
import {Config} from "../model/config";

const listen = function(worker) {
  /*
   * Read configuration variable.
   *
   * @listens cipherguard.config.read
   * @param requestId {uuid} The request identifier
   * @param name {string} Variable name to obtain
   */
  worker.port.on('cipherguard.config.read', (requestId, name) => {
    worker.port.emit(requestId, 'SUCCESS', Config.read(name));
  });

  /*
   * Read multiple configuration variables.
   *
   * @listens cipherguard.config.readAll
   * @param requestId {uuid} The request identifier
   * @param names {array} Variable names to obtain
   */
  worker.port.on('cipherguard.config.readAll', (requestId, names) => {
    const conf = {};
    for (const i in names) {
      conf[names[i]] = Config.read(names[i]);
    }
    worker.port.emit(requestId, 'SUCCESS', conf);
  });

  /*
   * Check if the plugin is well configured
   *
   * @listens cipherguard.addon.is-configured
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.addon.is-configured', requestId => {
    const user = User.getInstance();
    worker.port.emit(requestId, 'SUCCESS', user.isValid());
  });

  /*
   * Check if the current domain matches the trusted domain defined in configuration.
   * Only works if the plugin is configured.
   *
   * @listens cipherguard.addon.check-domain
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.addon.check-domain', requestId => {
    const trustedDomain = Config.read('user.settings.trustedDomain');
    if (typeof trustedDomain === 'undefined' || trustedDomain == '') {
      worker.port.emit(requestId, 'SUCCESS', false);
    }

    const domainOk = worker.tab.url.startsWith(trustedDomain);
    worker.port.emit(requestId, 'SUCCESS', domainOk);
  });

  /*
   * Get trusted domain.
   *
   * @listens cipherguard.addon.get-domain
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.addon.get-domain', requestId => {
    const trustedDomain = Config.read('user.settings.trustedDomain');
    worker.port.emit(requestId, 'SUCCESS', trustedDomain);
  });

  /*
   * Get plugin version.
   *
   * @listens cipherguard.addon.get-version
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.addon.get-version', async requestId => {
    const controller = new GetExtensionVersionController(worker, requestId);
    await controller._exec();
  });

  /*
   * Get plugin url.
   *
   * @listens cipherguard.addon.get-url
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.addon.get-url', requestId => {
    worker.port.emit(requestId, 'SUCCESS', chrome.runtime.getURL(''));
  });
};
export const ConfigEvents = {listen};
