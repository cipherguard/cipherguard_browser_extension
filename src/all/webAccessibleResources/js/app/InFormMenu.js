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
 * @since         3.4.0
 */
import React from "react";
import ReactDOM from "react-dom";
import ExtInFormMenu from "cipherguard-styleguide/src/react-web-integration/ExtInFormMenu";
import Port from "../lib/port";

async function main() {
  const query = new URLSearchParams(window.location.search);
  const portname = query.get('cipherguard');
  const port = new Port(portname);
  await port.connect();
  const storage = browser.storage;
  const domContainer = document.createElement("div");
  document.body.appendChild(domContainer);
  ReactDOM.render(React.createElement(ExtInFormMenu, {port: port, storage: storage}), domContainer);
}

main();
