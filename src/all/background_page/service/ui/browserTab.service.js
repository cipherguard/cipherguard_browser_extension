/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SARL (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.4.0
 */

class BrowserTabService {
  /**
   * Get the current tab
   */
  static async getCurrent() {
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    return tabs[0];
  }

  /**
   * Get by Id
   * @param id
   */
  static async getById(id) {
    const tabs = await browser.tabs.query({});
    return tabs.find(tab => tab.id === parseInt(id));
  }

  /**
   * Send message to a specific tab id and frame id
   * @param {any} worker
   * @param {any} message
   * @param {any} args
   * @returns {Promise<*>}
   */
  static async sendMessage(worker, message, ...args) {
    const requestArgs = [message].concat(args);
    return browser.tabs.sendMessage(worker.tabId, requestArgs, {frameId: worker.frameId});
  }

  /**
   * Reload the tab
   * @param id The id of the tab
   * @return {Promise<void>}
   */
  static async reloadTab(id) {
    await browser.tabs.reload(id);
  }
}

export default BrowserTabService;
