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
 * @since         3.0.0
 */

import CreateCommentController from "../controller/comment/createCommentController";
import DeleteCommentController from "../controller/comment/deleteCommentController";
import GetCommentsByRessourceController from "../controller/comment/getCommentsByRessourceIdController";

/**
 * Listens to the comments events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * ================================
   * SERVICE ACTIONS
   * ================================
   */
  /*
   * Create a new comment
   *
   * @listens cipherguard.comments.find-all-by-resource
   * @param requestId {uuid} The request identifier
   * @param resourceId {string} the resource uuid
   */
  worker.port.on('cipherguard.comments.find-all-by-resource', async(requestId, resourceId) => {
    const controller = new GetCommentsByRessourceController(worker, requestId, apiClientOptions);
    await controller._exec(resourceId);
  });

  /*
   * Create a new comment
   *
   *
   * @listens cipherguard.comments.create
   * @param requestId {uuid} The request identifier
   * @param commentDto {object} The comment
   */
  worker.port.on('cipherguard.comments.create', async(requestId, commentDto) => {
    const controller = new CreateCommentController(worker, requestId, apiClientOptions);
    await controller._exec(commentDto);
  });

  /*
   * delete a comment
   *
   * @listens cipherguard.comments.delete
   * @param requestId {uuid} The request identifier
   * @param comment {array} The comment
   */
  worker.port.on('cipherguard.comments.delete', async(requestId, commentId) => {
    const controller = new DeleteCommentController(worker, requestId, apiClientOptions);
    await controller._exec(commentId);
  });
};

export const CommentEvents = {listen};
