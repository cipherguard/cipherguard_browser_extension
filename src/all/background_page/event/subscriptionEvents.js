/**
 * Subscription events
 *
 * Used to handle the events related to the current subscription
 *
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
import SubscriptionController from "../controller/subscription/subscriptionController";

/**
 * Listens the subscription events
 * @param {Worker} worker
 * @param {ApiClientOptions} apiClientOptions the api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * Find the subscription
   *
   * @listens cipherguard.subscription.get
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.subscription.get', async requestId => {
    const subscriptionController = new SubscriptionController(worker, apiClientOptions);
    try {
      const subscriptionEntity = await subscriptionController.getSubscription();
      worker.port.emit(requestId, 'SUCCESS', subscriptionEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });

  /*
   * Update the subscription key
   *
   * @listens cipherguard.subscription.get
   * @param requestId {uuid} The request identifier
   */
  worker.port.on('cipherguard.subscription.update', async(requestId, subscriptionKeyDto) => {
    const subscriptionController = new SubscriptionController(worker, apiClientOptions);
    try {
      const subscriptionEntity = await subscriptionController.updateSubscription(subscriptionKeyDto);
      worker.port.emit(requestId, 'SUCCESS', subscriptionEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};
export const SubscriptionEvents = {listen};
