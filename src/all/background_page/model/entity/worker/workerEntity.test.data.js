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
import {v4 as uuidv4} from "uuid";
import WorkerEntity from "./workerEntity";

export const readWorker = (data = {}) => {
  const defaultObject = {
    id: uuidv4(),
    name: "worker",
    tabId: 1,
    frameId: 0,
    status: WorkerEntity.STATUS_CONNECTED
  };
  return Object.assign(defaultObject, data);
};
