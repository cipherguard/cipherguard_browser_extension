/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2020 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2020 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         3.0.0
 */
import React from "react";
import ReactDOM from "react-dom";
import ExtApp from "cipherguard-styleguide/src/react-extension/ExtApp";
import Port from "../lib/port";
import MessageService from "../../../contentScripts/js/service/messageService";
import MessageEventHandler from "../../../contentScripts/js/message/messageEventHandler";
import ConnectPortController from "../../../contentScripts/js/controller/connectPortController";

async function main() {
  const query = new URLSearchParams(window.location.search);
  const portname = query.get('cipherguard');
  const port = new Port(portname);
  await port.connect();
  // Message listener
  const messageService = new MessageService();
  const messageEventHandler = new MessageEventHandler(messageService);
  messageEventHandler.listen("cipherguard.port.connect", ConnectPortController, port);
  const storage = browser.storage;
  const domContainer = document.createElement("div");
  document.body.appendChild(domContainer);
  ReactDOM.render(React.createElement(ExtApp, {port: port, storage: storage}), domContainer);
}

main();
