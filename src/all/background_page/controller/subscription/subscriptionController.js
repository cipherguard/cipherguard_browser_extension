/**
 * Subscription controller
 *
 * Used to handle the operation related to the current subscription
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
import SubscriptionModel from "../../model/subscription/subscriptionModel";
import UpdateSubscriptionEntity from "../../model/entity/subscription/update/updateSubscriptionEntity";


class SubscriptionController {
  /**
   * SubscriptionController constructor
   * @param {Worker} worker
   * @param {ApiClientOptions} clientOptions
   */
  constructor(worker, clientOptions) {
    this.worker = worker;

    // Models
    this.subscriptionModel = new SubscriptionModel(clientOptions);
  }

  /**
   * Get the subscription
   * @returns {Promise<SubscriptionEntity>} The subscription
   */
  async getSubscription() {
    return await this.subscriptionModel.find();
  }

  /**
   * Update the subscription
   * @param subscriptionKeyDto The new subscription key
   * @returns {Promise<SubscriptionEntity>} The subscription
   */
  async updateSubscription(subscriptionKeyDto) {
    const updateSubscriptionEntity = new UpdateSubscriptionEntity(subscriptionKeyDto);
    return await this.subscriptionModel.update(updateSubscriptionEntity);
  }
}

export default SubscriptionController;
