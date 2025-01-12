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

/**
 * Mock an API response
 * @param {Object} body The response body
 * @returns {Promise<string>} The response serialized in JSON.
 */
exports.mockApiResponse = (body = {}, header = {}) => Promise.resolve(JSON.stringify({header: header, body: body}));

exports.mockApiRedirectResponse = (redirectTo, status = 302) => Promise.resolve({
  status: status,
  url: redirectTo,
  body: JSON.stringify({
    header: {
      status: status
    },
    body: {}
  })
});

exports.mockApiResponseError = (status, errorMessage, body = {}) => Promise.resolve({
  status: status,
  body: JSON.stringify({
    header: {
      message: errorMessage,
      status: status
    },
    body: body
  })
});
