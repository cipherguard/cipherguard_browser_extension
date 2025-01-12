/**
 * Toolbar model.
 *
 * @copyright (c) 2017 Cipherguard SARL
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
import User from "./user";

/**
 * Toolbar constructor.
 * @constructor
 */
const Toolbar = function() {};

/**
 * Get the toolbar url, that will be used when the user click
 * on the toolbar cipherguard button.
 *
 * Regarding the current user configuration, the results can be :
 * - Plugin installed but not configured, return the public page getting started url;
 * - Plugin installed and configured, return the cipherguard url.
 * @return {string}
 */
Toolbar.getToolbarUrl = function() {
  const user = User.getInstance();

  return user.isValid()
    ? user.settings.getDomain() // The plugin is installed and configured
    : 'https://www.cipherguard.com/start'; // The plugin is installed but not configured
};


export default Toolbar;
