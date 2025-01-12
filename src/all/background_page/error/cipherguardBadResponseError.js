/**
 * Bad response
 *
 * @copyright (c) 2019 Cipherguard SA
 * @licence GNU Affero General Public License http://www.gnu.org/licenses/agpl-3.0.en.html
 */
import i18n from "../sdk/i18n";

class CipherguardBadResponseError extends Error {
  constructor(error, response) {
    super(i18n.t('An internal error occurred. The server response could not be parsed. Please contact your administrator.'));
    this.name = 'CipherguardBadResponseError';
    this.srcError = error;
    this.srcResponse = response;
  }
}

export default CipherguardBadResponseError;
