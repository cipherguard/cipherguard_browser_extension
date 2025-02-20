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
 * @since         3.3.0
 */
import ResourceInProgressCacheService from "./resourceInProgressCache.service";
import ExternalResourceEntity from "../../model/entity/resource/external/externalResourceEntity";
import PostLogoutService from "../auth/postLogoutService";

jest.useFakeTimers();

const fakeResourceDto = {
  "name": "",
  "username": "",
  "uri": "",
  "secret_clear": ""
};

// Reset the modules before each test.
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.clearAllTimers();
});

describe("ResourceInProgressCache service", () => {
  it("should trigger a reset after a logout", async() => {
    expect.assertions(5);
    const spyOnStorageSet = jest.spyOn(browser.storage.session, "set");
    const spy = jest.spyOn(ResourceInProgressCacheService, "reset");
    const fakeResource = new ExternalResourceEntity(fakeResourceDto);

    expect(spy).not.toHaveBeenCalled();

    await ResourceInProgressCacheService.set(fakeResource);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyOnStorageSet).toHaveBeenCalledTimes(1);
    expect(spyOnStorageSet).toHaveBeenCalledWith({resourceInProgress: fakeResource.toDto()});

    await PostLogoutService.exec();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should do a reset after a period of time", async() => {
    expect.assertions(6);
    const spy = jest.spyOn(ResourceInProgressCacheService, "reset");
    jest.spyOn(global, "setTimeout");
    jest.spyOn(global, "clearTimeout");
    const timeoutDelay = 5000;
    const fakeResource = new ExternalResourceEntity(fakeResourceDto);

    expect(spy).not.toHaveBeenCalled();

    await ResourceInProgressCacheService.set(fakeResource, timeoutDelay);
    expect(spy).toHaveBeenCalledTimes(1);
    //Called 1 times during the ::set
    expect(global.setTimeout).toHaveBeenCalledTimes(1);
    expect(global.clearTimeout).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(timeoutDelay);
    expect(spy).toHaveBeenCalledTimes(2);
    //Called 2 time after the reset
    expect(global.clearTimeout).toHaveBeenCalledTimes(2);
  });

  it("should do a reset after having consumed the cached resource", async() => {
    expect.assertions(3);
    const spy = jest.spyOn(ResourceInProgressCacheService, "reset");
    const fakeResource = new ExternalResourceEntity(fakeResourceDto);

    expect(spy).not.toHaveBeenCalled();

    await ResourceInProgressCacheService.set(fakeResource, Number.MAX_SAFE_INTEGER);
    expect(spy).toHaveBeenCalledTimes(1);

    await ResourceInProgressCacheService.consume();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("should have cleared the cached memory after a reset", async() => {
    expect.assertions(3);
    const fakeResource = new ExternalResourceEntity(fakeResourceDto);

    const emptyResource = await ResourceInProgressCacheService.consume();
    expect(emptyResource).toBe(null);

    await ResourceInProgressCacheService.set(fakeResource, Number.MAX_SAFE_INTEGER);
    const cachedResource = await ResourceInProgressCacheService.consume();
    expect(cachedResource).toEqual(fakeResource.toDto());

    const clearedResource = await ResourceInProgressCacheService.consume();
    expect(clearedResource).toBe(null);
  });
});
