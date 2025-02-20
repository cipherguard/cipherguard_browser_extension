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
 */
import ActionLogModel from "../model/actionLog/actionLogModel";

/**
 * Listens to the action logs events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * Find all action logs for a given instance
   *
   * @listens cipherguard.actionlogs.find-all-for
   * @param requestId {uuid} The request identifier
   * @param options {object} The options to apply to the find
   */
  worker.port.on('cipherguard.actionlogs.find-all-for', async(requestId, foreignModel, foreignId, options) => {
    try {
      const actionLogModel = new ActionLogModel(apiClientOptions);
      const {limit, page} = options;
      const actionLogs = await actionLogModel.findAllFor(foreignModel, foreignId, page, limit);
      worker.port.emit(requestId, 'SUCCESS', actionLogs);
    } catch (error) {
      console.error(error);
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};

export const ActionLogEvents = {listen};
