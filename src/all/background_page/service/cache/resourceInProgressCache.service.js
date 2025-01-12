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
 * @since         3.4
 */

import ExternalResourceEntity from "../../model/entity/resource/external/externalResourceEntity";

/** Default validity timeout of the cache */
const VALIDITY_TIMEOUT_IN_MS = 6000;

const RESOURCE_IN_PROGRESS_STORAGE_KEY = "resourceInProgress";

/**
 * A cache service used whenever one wants to store information about a resource creation in progress.
 * This cache is a one-shot getter i.e. after one call the get, the cache is reset. Moreover, the cache information
 * is stored for a certain time given when one set a value and whenever the user is logged out
 */
class ResourceInProgressCacheService {
  /**
   * Default constructor
   */
  constructor() {
    this.bindCallbacks();
    this.timeoutId = null;
  }

  /**
   * Bind callbacks
   */
  bindCallbacks() {
    this.reset = this.reset.bind(this);
  }

  /**
   * Consume the cached resource.
   * @return {Object} A resource DTO
   */
  async consume() {
    const storedResourceData = await browser.storage.session.get(RESOURCE_IN_PROGRESS_STORAGE_KEY);
    this.reset();
    return storedResourceData?.[RESOURCE_IN_PROGRESS_STORAGE_KEY] || null;
  }

  /**
   * Store a resource in cache.
   * @param {ExternalResourceEntity|object} resource The resource to store in cache.
   * @param {?int} timeoutInMs Period of time in millsecond after which the cache will be cleaned.
   */
  async set(resource, timeoutInMs = VALIDITY_TIMEOUT_IN_MS) {
    if (!(resource instanceof ExternalResourceEntity)) {
      throw new TypeError('ResourceInProgressCacheService::set expects a ExternalResourceEntity');
    }
    // Clean everything before set the value
    this.reset();

    await browser.storage.session.set({[RESOURCE_IN_PROGRESS_STORAGE_KEY]: resource.toDto()});
    // Set a timeout to clean the cache if not consumed
    this.timeoutId = setTimeout(this.reset, timeoutInMs);
  }

  /**
   * Resets the cache
   */
  reset() {
    browser.storage.session.remove(RESOURCE_IN_PROGRESS_STORAGE_KEY);
    // Clear the timeout
    clearTimeout(this.timeoutId);
  }
}

export default new ResourceInProgressCacheService();
