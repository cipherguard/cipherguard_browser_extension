/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.7.0
 */

export const userLoggedOutAuthStatus = () => ({
  isAuthenticated: false,
  isMfaRequired: false,
});

export const userLoggedInAuthStatus = () => ({
  isAuthenticated: true,
  isMfaRequired: false,
});

export const userRequireMfaAuthStatus = () => ({
  isAuthenticated: true,
  isMfaRequired: true,
});
