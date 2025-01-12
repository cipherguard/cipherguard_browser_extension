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
 * @since         3.5.0
 */
import fs from "fs";

describe("Locales", () => {
  it("Extension name and description have the right size.", async() => {
    const localesPath = "./src/all/_locales";
    const dir = await fs.promises.opendir(localesPath);
    const extensionNameLength = 45;
    const extensionDescriptionLength = 85;

    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        const locale = dirent.name;
        const localeFilePath = `${localesPath}/${locale}/messages.json`;
        const localeContent = JSON.parse(fs.readFileSync(localeFilePath));

        try {
          expect(localeContent.appName.message.length).toBeLessThanOrEqual(extensionNameLength);
        } catch (error) {
          throw new Error(`Extension name for locale "${locale}" should not be greater than ${extensionNameLength} characters`);
        }

        try {
          expect(localeContent.appDescription.message.length).toBeLessThanOrEqual(extensionDescriptionLength);
        } catch (error) {
          throw new Error(`Extension description for locale "${locale}" should not be greater than ${extensionDescriptionLength} characters`);
        }
      }
    }
  });
});
