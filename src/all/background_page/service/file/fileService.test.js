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
 * @since         3.9.0
 */

import FileService from "./fileService";
import WorkerService from "../worker/workerService";

// Reset the modules before each test.
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("FileService", () => {
  describe("FileService::saveFile", () => {
    it("save file with chrome", async() => {
      expect.assertions(3);
      // data mocked
      chrome.downloads = {
        download: jest.fn(() => Promise.resolve())
      };
      global.URL.createObjectURL = jest.fn();
      global.URL.revokeObjectURL = jest.fn();
      const resultUrl = "blob:https://cipherguard.dev/8a3e66b9-4646-4077-815a-5978936aa6d6";
      // mock function
      jest.spyOn(browser.scripting, "executeScript").mockImplementation(async script => {
        const url = script.func.apply(null, script.args);
        return [{result: url}];
      });
      jest.spyOn(self.URL, "createObjectURL").mockImplementationOnce(() => resultUrl);
      // process
      await FileService.saveFile("filename", "Text", null, 1);
      // expectation
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
      expect(chrome.downloads.download).toHaveBeenCalledWith({filename: "filename", url: resultUrl});
    });

    it("save file with firefox", async() => {
      expect.assertions(1);
      // data mocked
      const worker = {
        port: {
          emit: jest.fn()
        }
      };
      chrome.downloads = undefined;
      // function mocked
      jest.spyOn(WorkerService, "get").mockImplementationOnce(() => Promise.resolve(worker));
      // process
      await FileService.saveFile("filename", "Text", null, 1);
      // expectation
      expect(worker.port.emit).toHaveBeenCalledWith("cipherguard.file-iframe.download", "filename", "data:text/plain;base64,VGV4dA==");
    });
  });
});
