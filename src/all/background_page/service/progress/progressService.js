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

/*
 * Delay in ms to wait in between 2 progression steps before refreshing the UI.
 */
const STEP_DELAY_MS = 80;

class ProgressService {
  /**
   * @constructor
   * @param {Worker} worker
   * @param {string} title
   */
  constructor(worker, title) {
    this.worker = worker;
    this._title = title;
    this._progress = 0;
    this.lastTimeCall = null;
    this.message = null;
    this.isClose = false;
  }

  /**
   * Set a new title for the progress dialog.
   * The title is given to the UI only at ProgressService.start(), so, this method needs to be called before.
   * @param {string} title
   */
  set title(title) {
    this._title = title;
  }

  /**
   * Returns the current progression
   * @returns {number}
   */
  get progress() {
    return this._progress;
  }

  /**
   * Returns the current goals
   * @returns {number}
   */
  get goals() {
    return this._goals;
  }

  /**
   * Start the progression of a task by:
   *  - settings the target goal
   *  - opening a progress dialog
   * @param {number|null} goals The total progress goals
   * @param {string|null} message The initial message to display
   */
  start(goals, message) {
    this._progress = 0;
    this._goals = goals;
    this.isClose = false;
    this.worker.port.emit('cipherguard.progress.open-progress-dialog', this._title, goals, message);
    this.lastTimeCall = new Date().getTime();
  }

  /**
   * Changes the goal count of the current progression
   * @param {number} goals
   */
  updateGoals(goals) {
    this._goals = goals;
    this.worker.port.emit('cipherguard.progress.update-goals', goals);
  }

  /**
   * Updates the progress bar with the latest finished step.
   * @param {string|null} [message = null] The message to display
   * @param {boolean} [forceMessageDisplay = false] Should the message display be forced.
   */
  finishStep(message = null, forceMessageDisplay = false) {
    this.finishSteps(1, message, forceMessageDisplay);
  }

  /**
   * Updates the progress bar given a step count.
   * @param {number} stepCount the count of step to update the progress bar with.
   * @param {string|null} [message = null] The message to display. If null, the update of the message is ignored
   * @param {boolean} [forceMessageDisplay = false] Should the message display be forced.
   */
  finishSteps(stepCount, message = null, forceMessageDisplay = false) {
    this._progress += stepCount;
    if (message !== null) {
      this.message = message;
    }
    this._debounceAction(() => this._updateProgressBar(), forceMessageDisplay);
  }

  /**
   * Update step message, conserving the same progress.
   * @param {string} message The message to display
   */
  updateStepMessage(message) {
    this.message = message;
    this._debounceAction(() => this._updateProgressBar());
  }

  /**
   * Ends the progression of a task by closing the dialog
   */
  close() {
    this.isClose = true;
    this.worker.port.emit('cipherguard.progress.close-progress-dialog');
  }

  /**
   * Sends a message to the UI in order to update it.
   * @private
   */
  _updateProgressBar() {
    this.worker.port.emit('cipherguard.progress.update', this.message, this._progress);
  }

  /**
   * Run the given callback if enough time has been spent before last call
   * @param {func} callback the callback to run if the delay is passed
   * @param {boolean} forceCallbackCall if true the callback is called regardless of the delay
   * @private
   */
  _debounceAction(callback, forceCallbackCall = false) {
    if (this.isClose) {
      return;
    }

    const currentTime = new Date().getTime();
    const deltaTime = currentTime - this.lastTimeCall;
    if (!forceCallbackCall && deltaTime < STEP_DELAY_MS) {
      return;
    }

    this.lastTimeCall = currentTime;
    callback();
  }
}

export default ProgressService;
