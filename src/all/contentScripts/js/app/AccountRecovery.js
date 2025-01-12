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

import React from "react";
import ReactDOM from "react-dom";
import ExtBootstrapAccountRecovery from "cipherguard-styleguide/src/react-extension/ExtBootstrapAccountRecovery";
import Port from "../../../webAccessibleResources/js/lib/port";
import MessageService from "../service/messageService";
import MessageEventHandler from "../message/messageEventHandler";
import ConnectPortController from "../controller/connectPortController";

async function main() {
  // Port connection
  const port = new Port(self.portname);
  // Emit a success if the port is still connected
  port.on("cipherguard.port.check", requestId => port.emit(requestId, "SUCCESS"));
  await port.connect();
  // Message listener
  const messageService = new MessageService();
  const messageEventHandler = new MessageEventHandler(messageService);
  messageEventHandler.listen("cipherguard.port.connect", ConnectPortController, port);
  // Start ExtBootstrapAccountRecovery
  const browserExtensionUrl = chrome.runtime.getURL("/");
  const domContainer = document.createElement("div");
  document.body.appendChild(domContainer);
  ReactDOM.render(<ExtBootstrapAccountRecovery port={port} browserExtensionUrl={browserExtensionUrl}/>, domContainer);
}

main();
