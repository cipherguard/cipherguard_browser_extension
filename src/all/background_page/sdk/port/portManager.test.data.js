/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2023 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         4.0.0
 */

export const mockPort = jest.fn(({name, tabId, frameId, url = ""}) => ({
  name: name,
  sender: {
    tab: {
      id: tabId
    },
    frameId: frameId,
    url:  url
  },
  postMessage: jest.fn(),
  onDisconnect: {
    addListener: jest.fn(),
  },
  onMessage: {
    addListener: jest.fn(),
  },
  disconnect: jest.fn(),
}));
