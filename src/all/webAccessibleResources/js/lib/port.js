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
 * @since         2.0.0
 */
import {v4 as uuidv4} from "uuid";
import Lock from "../../../background_page/utils/lock";

class Port {
  /**
   *
   * @param {string} name
   */
  constructor(name) {
    this._listeners = {};
    this.lock = new Lock();
    this.onConnectErrorHandler = {};
    if (typeof name === "undefined") {
      throw Error("A port name is required.");
    } else if (typeof name  !== "string") {
      throw Error("The port name should be a valid string.");
    }

    this._name = name;
  }

  /**
   * Connect the port
   * @returns {Promise<>}
   */
  connect() {
    let resolver;
    const promise = new Promise(resolve => { resolver = resolve; });
    try {
      this._port = browser.runtime.connect({name: this._name});
    } catch (error) {
      /**
       * Error happen only if there is no listener in the service worker or if the context is invalidated by an update
       * The call back should remove listeners in content script which still running after an update.
       * In case of a user click manually on the button to update the extension,
       * there is no process to clean the content script, so it prevent issues on a port reconnection.
       */
      this.onConnectErrorHandler.callback();
      throw error;
    }
    this._connected = true;
    this.initListener();
    this.once("cipherguard.port.ready", resolver);
    return promise;
  }

  /**
   * Init listener
   * @private
   */
  initListener() {
    this._port.onDisconnect.addListener(() => {
      console.warn(`port disconnected from addon code: ${this._name}`);
      this._connected = false;
    });

    this._port.onMessage.addListener(msg => {
      this._onMessage(msg);
    });
  }

  /**
   * When a message is received on the port
   * Triggers all the callback associated with that message name
   *
   * @param json
   * @private
   */
  _onMessage(json) {
    const msg = JSON.parse(json);
    const eventName = msg[0];
    if (Array.isArray(this._listeners[eventName])) {
      const listeners = this._listeners[eventName];
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        const args = Array.prototype.slice.call(msg, 1);
        listener.callback.apply(this, args);
        if (listener.once) {
          this._listeners[eventName].splice(i, 1);
          // delete the listener if empty array
          if (this._listeners[eventName].length === 0) {
            delete this._listeners[eventName];
          }
          i--; // jump back since i++ is the new i
        }
      }
    }
  }

  /**
   * Add listener for a message name on the current port
   *
   * @param name string
   * @param callback function
   * @param once bool
   * @private
   */
  _addListener(name, callback, once) {
    if (!Array.isArray(this._listeners[name])) {
      this._listeners[name] = [];
    }
    this._listeners[name].push({
      name: name,
      callback: callback,
      once: once
    });
  }

  /**
   * On message name triggers a callback
   *
   * @param name
   * @param callback
   */
  on(name, callback) {
    this._addListener(name, callback, false);
  }

  /**
   * On message name triggers a callback only once,
   * e.g. remove the listener once the message has been received
   *
   * @param name
   * @param callback
   */
  once(name, callback) {
    this._addListener(name, callback, true);
  }

  /**
   * Emit a message to the addon code
   * @param requestArgs the arguments
   */
  async emit(...requestArgs) {
    const message = JSON.stringify(requestArgs);
    await this.connectIfDisconnected();
    this._port.postMessage(message);
  }

  /**
   * Emit a request to the addon code and expect a response.
   * @param message the message
   * @param args the arguments
   * @return Promise
   */
  request(message, ...args) {
    // Generate a request id that will be used by the addon to answer this request.
    const requestId = uuidv4();
    // Add the requestId to the request parameters.
    const requestArgs = [message, requestId].concat(args);

    // The promise that is return when you call cipherguard.request.
    return new Promise((resolve, reject) => {
      /*
       * Observe when the request has been completed.
       * Or if a progress notification is sent.
       */
      this.once(requestId, (status, ...callbackArgs) => {
        if (status === 'SUCCESS') {
          resolve.apply(null, callbackArgs);
        } else if (status === 'ERROR') {
          reject.apply(null, callbackArgs);
        }
      });
      // Emit the message to the addon-code.
      this.emit.apply(this, requestArgs);
    });
  }

  /**
   * Connect the port if disconnected
   * @returns {Promise<void>}
   */
  async connectIfDisconnected() {
    try {
      await this.lock.acquire();
      if (!this._connected) {
        await this.connect();
      }
    } finally {
      this.lock.release();
    }
  }

  /**
   * Assign a callback on a connect error
   * @param {function} callback The callback
   */
  onConnectError(callback) {
    this.onConnectErrorHandler.callback = callback;
  }
}

export default Port;
