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
 * @since         3.8.0
 */
const browser = require("webextension-polyfill");
const ScriptingPolyfill = require("./scriptingPolyfill");
const SessionStoragePolyfill = require("./sessionStoragePolyfill");

// mv3 scripting API for mv2
if (!browser.scripting) {
  browser.scripting = new ScriptingPolyfill(browser);
}
// mv3 session storage API polyfill
if (!browser.storage.session) {
  browser.storage.session = new SessionStoragePolyfill();
}
// mv3 action API polyfill for mv2
if (!browser.action) {
  browser.action = browser.browserAction;
}

module.exports = browser;
