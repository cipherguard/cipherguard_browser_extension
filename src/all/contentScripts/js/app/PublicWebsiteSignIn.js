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
 * @since         3.7.0
 */
import {PublicWebsiteSignInBootstrap} from "cipherguard-styleguide/src/public-website-sign-in/PublicWebsiteSignInBootstrap.js";
import Port from "../../../webAccessibleResources/js/lib/port";

async function main() {
  // Make the port object as a global variable to use it directly (TODO the port could be use in props)
  self.port = new Port(self.portname);
  // Emit a success if the port is still connected
  port.on("cipherguard.port.check", requestId => self.port.emit(requestId, "SUCCESS"));
  await self.port.connect();
  PublicWebsiteSignInBootstrap.init();
}

main();
