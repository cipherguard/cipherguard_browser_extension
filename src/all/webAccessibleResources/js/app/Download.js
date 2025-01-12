/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) 2021 Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2021 Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 */
import download from "downloadjs/download";
import Port from "../lib/port";

// Wait the document to be ready before executing the script given in parameter.
const iframeReady = callback => {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
};

iframeReady(async() => {
  const query = new URLSearchParams(window.location.search);
  const portname = query.get('cipherguard');
  const port = new Port(portname);
  await port.connect();
  port.on('cipherguard.file-iframe.download', (filename, content) => {
    download(content, filename, "text/plain");
  });
});
