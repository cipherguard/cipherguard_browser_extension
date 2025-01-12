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
 * @since         4.0.0
 */
import PortManager from "../../sdk/port/portManager";
import WorkersSessionStorage from "../sessionStorage/workersSessionStorage";
import BrowserTabService from "../ui/browserTab.service";
import WorkerEntity from "../../model/entity/worker/workerEntity";
import WebNavigationService from "../webNavigation/webNavigationService";

const WORKER_EXIST_TIME_CHECKING = 100;
const WORKER_CHECK_STATUS_TIME_CHECKING = 50;

class WorkerService {
  static timeoutByWorkerID = {};

  /**
   *
   * Get the worker according to the application name and tab id
   *
   * @param {string} applicationName The application name
   * @param {number} tabId The tab id
   * @returns {Promise<Worker>} The worker
   */
  static async get(applicationName, tabId) {
    const workers = await WorkersSessionStorage.getWorkersByNameAndTabId(applicationName, tabId);
    if (workers.length === 0) {
      throw new Error(`Could not find worker ${applicationName} for tab ${tabId}.`);
    }
    // Get only the first worker
    const worker = workers[0];
    if (!PortManager.isPortExist(worker.id)) {
      await BrowserTabService.sendMessage(worker, "cipherguard.port.connect", worker.id);
    }
    const port = await PortManager.getPortById(worker.id);
    const tab = port._port.sender.tab;
    return {port, tab};
  }

  /**
   * Wait until a worker exists
   * @param {string} applicationName The application name
   * @param {number} tabId The tab identifier on which the worker runs
   * @param {int} numberOfRetry The number of retry before rejecting the promise
   * @return {Promise<void>}
   */
  static async waitExists(applicationName, tabId, numberOfRetry = 50) {
    // Handle worker exist and check 50 times (5 seconds)
    const handleWorkerExist = async(resolve, reject, numberOfRetry) => {
      try {
        await this.get(applicationName, tabId);
        resolve();
      } catch (error) {
        if (numberOfRetry <= 0) {
          reject(error);
        } else {
          // Use timeout cause alarm are fired at a minimum of 30 seconds
          setTimeout(handleWorkerExist, WORKER_EXIST_TIME_CHECKING, resolve, reject, numberOfRetry - 1);
        }
      }
    };

    return new Promise((resolve, reject) => {
      handleWorkerExist(resolve, reject, numberOfRetry);
    });
  }

  /**
   * Clear and use a timeout to execute a navigation for worker which are waiting for connection
   * @param {WorkerEntity} workerEntity The worker entity
   * @returns {Promise<void>}
   */
  static async checkAndExecNavigationForWorkerWaitingConnection(workerEntity) {
    // Clear timeout to take only the last event of the worker to check
    clearTimeout(this.timeoutByWorkerID[workerEntity.id]);
    // Use timeout cause alarm are fired at a minimum of 30 seconds
    this.timeoutByWorkerID[workerEntity.id] = setTimeout(this.execNavigationForWorkerWaitingConnection, WORKER_CHECK_STATUS_TIME_CHECKING, workerEntity.id);
  }

  /**
   * Treat debounced navigation due to worker awaiting initial connection or reconnection with the content script
   * application.
   * @private
   * @param {string} workerId The worker identifier.
   * @return {Promise<void>}
   */
  static async execNavigationForWorkerWaitingConnection(workerId) {
    const worker = await WorkersSessionStorage.getWorkerById(workerId);
    if (!worker) {
      console.debug(`WorkerService::execNavigationForWorkerWaitingConnection(${workerId}): Worker not found.`);
      return;
    }

    const workerEntity = new WorkerEntity(worker);
    if (!workerEntity.isWaitingConnection && !workerEntity.isReconnecting) {
      console.debug(`WorkerService::execNavigationForWorkerWaitingConnection(${workerId}): Worker port connected to the content script application.`);
      return;
    }

    // Get the tab information by tab id to have the last url in case of redirection
    const tab = await BrowserTabService.getById(workerEntity.tabId);
    // Execute the process of a web navigation to detect pagemod and script to insert
    const frameDetails = {
      // Mapping the tab info as a frame details to be compliant with webNavigation API
      frameId: 0,
      tabId: worker.tabId,
      url: tab.url
    };

    console.debug(`WorkerService::execNavigationForWorkerWaitingConnection(${workerId}): Trigger pagemods identification process.`);
    await WebNavigationService.exec(frameDetails);
  }

  /**
   * Send message to destroy all worker to invalidate content script
   * @param {Array<string>} workersName
   * @return {Promise<void>}
   */
  static async destroyWorkersByName(workersName) {
    this.emitOnWorkersWithName('cipherguard.content-script.destroy', workersName);
  }

  /**
   * Emit an event to all workers matching the given workersName
   * @param {string} eventName
   * @param {Array<string>} workersName
   * @return {Promise<void>}
   */
  static async emitOnWorkersWithName(eventName, workersName) {
    const workers = await WorkersSessionStorage.getWorkersByNames(workersName);
    for (const worker of workers) {
      if (!PortManager.isPortExist(worker.id)) {
        try {
          await BrowserTabService.sendMessage(worker, "cipherguard.port.connect", worker.id);
        } catch (error) {
          console.debug("Unable to reconnect the port prior to emitting event");
          console.error(error);
          continue;
        }
      }
      const port = PortManager.getPortById(worker.id);
      port.emit(eventName);
    }
  }
}

export default WorkerService;
