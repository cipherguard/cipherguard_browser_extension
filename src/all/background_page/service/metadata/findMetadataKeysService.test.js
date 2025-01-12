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
 * @since         4.10.0
 */

import {enableFetchMocks} from "jest-fetch-mock";
import AccountEntity from "../../model/entity/account/accountEntity";
import {defaultAccountDto} from "../../model/entity/account/accountEntity.test.data";
import PassphraseStorageService from "../session_storage/passphraseStorageService";
import BuildApiClientOptionsService from "../account/buildApiClientOptionsService";
import FindMetadataKeysService from "./findMetadataKeysService";
import {mockApiResponseError} from "cipherguard-styleguide/test/mocks/mockApiResponse";
import CipherguardApiFetchError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardApiFetchError";
import CipherguardServiceUnavailableError from "cipherguard-styleguide/src/shared/lib/Error/CipherguardServiceUnavailableError";
import {defaultMetadataKeyDto} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeyEntity.test.data";
import MetadataKeysCollection from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataKeysCollection";
import {pgpKeys} from "cipherguard-styleguide/test/fixture/pgpKeys/keys";
import {decryptedMetadataPrivateKeyDto, defaultMetadataPrivateKeyDto} from "cipherguard-styleguide/src/shared/models/entity/metadata/metadataPrivateKeyEntity.test.data";
import {v4 as uuidv4} from "uuid";

describe("FindMetadataKeysApiService", () => {
  let apiClientOptions, account;
  beforeEach(async() => {
    enableFetchMocks();
    fetch.resetMocks();
    account = new AccountEntity(defaultAccountDto());
    apiClientOptions = BuildApiClientOptionsService.buildFromAccount(account);
  });

  describe('::findAll', () => {
    it("retrieves the settings from API", async() => {
      expect.assertions(5);

      const spyOnPassphraseStorage = jest.spyOn(PassphraseStorageService, "get");
      spyOnPassphraseStorage.mockImplementation(() => pgpKeys.ada.passphrase);

      const id = uuidv4();
      const metadata_private_keys = [defaultMetadataPrivateKeyDto({metadata_key_id: id, data: pgpKeys.metadataKey.encryptedMetadataPrivateKeyDataMessage})];
      const apiMetadataKeysCollection = [defaultMetadataKeyDto({id, metadata_private_keys})];

      const service = new FindMetadataKeysService(apiClientOptions, account);
      const spyOnFindService = jest.spyOn(service.metadataKeysApiService, "findAll");
      spyOnFindService.mockImplementation(() => apiMetadataKeysCollection);
      const resultDto = await service.findAll();

      expect(resultDto).toBeInstanceOf(MetadataKeysCollection);
      expect(resultDto).toHaveLength(apiMetadataKeysCollection.length);
      expect(resultDto.hasEncryptedKeys()).toStrictEqual(false);
      expect(spyOnFindService).toHaveBeenCalledTimes(1);
      expect(spyOnFindService).toHaveBeenCalledWith({});
    });

    it("throws an error if the keys from the API is already decrypted", async() => {
      expect.assertions(1);

      const spyOnPassphraseStorage = jest.spyOn(PassphraseStorageService, "get");
      spyOnPassphraseStorage.mockImplementation(() => pgpKeys.ada.passphrase);

      const id = uuidv4();
      const metadata_private_keys = [decryptedMetadataPrivateKeyDto({metadata_key_id: id})];
      const apiMetadataKeysCollection = [defaultMetadataKeyDto({id, metadata_private_keys})];

      const service = new FindMetadataKeysService(apiClientOptions, account);
      const spyOnFindService = jest.spyOn(service.metadataKeysApiService, "findAll");
      spyOnFindService.mockImplementation(() => apiMetadataKeysCollection);

      const expectedError = new Error("The metadata private keys should not be decrypted.");
      await expect(() => service.findAll()).rejects.toThrow(expectedError);
    });

    it("throws API error if the API encountered an issue", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys/, () => mockApiResponseError(500, "Something wrong happened!"));

      const service = new FindMetadataKeysService(apiClientOptions);

      await expect(() => service.findAll()).rejects.toThrow(CipherguardApiFetchError);
    });

    it("throws service unavailable error if an error occurred but not from the API (by instance cloudflare)", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys/, () => { throw new Error("Service unavailable"); });

      const service = new FindMetadataKeysService(apiClientOptions);

      await expect(() => service.findAll()).rejects.toThrow(CipherguardServiceUnavailableError);
    });

    it("throws an error if the given contains are not supported", async() => {
      expect.assertions(1);

      const service = new FindMetadataKeysService(apiClientOptions);
      const fakeContains = {wrongOne: true};

      const expectedError = new Error("Unsupported contains parameter used, please check supported contains");

      await expect(() => service.findAll(fakeContains)).rejects.toThrow(expectedError);
    });
  });

  describe('::findAllForSessionStorage', () => {
    it("retrieves the settings from API with the right contains", async() => {
      expect.assertions(5);

      const spyOnPassphraseStorage = jest.spyOn(PassphraseStorageService, "get");
      spyOnPassphraseStorage.mockImplementation(() => pgpKeys.ada.passphrase);

      const id = uuidv4();
      const metadata_private_keys = [defaultMetadataPrivateKeyDto({metadata_key_id: id, data: pgpKeys.metadataKey.encryptedMetadataPrivateKeyDataMessage})];
      const apiMetadataKeysCollection = [defaultMetadataKeyDto({id, metadata_private_keys})];

      const service = new FindMetadataKeysService(apiClientOptions, account);
      const spyOnFindService = jest.spyOn(service.metadataKeysApiService, "findAll");
      spyOnFindService.mockImplementation(() => apiMetadataKeysCollection);
      const resultDto = await service.findAllForSessionStorage();

      expect(resultDto).toBeInstanceOf(MetadataKeysCollection);
      expect(resultDto).toHaveLength(apiMetadataKeysCollection.length);
      expect(resultDto.hasEncryptedKeys()).toStrictEqual(false);
      expect(spyOnFindService).toHaveBeenCalledTimes(1);
      expect(spyOnFindService).toHaveBeenCalledWith({metadata_private_keys: true});
    });

    it("throws an error if the keys from the API is already decrypted", async() => {
      expect.assertions(1);

      const spyOnPassphraseStorage = jest.spyOn(PassphraseStorageService, "get");
      spyOnPassphraseStorage.mockImplementation(() => pgpKeys.ada.passphrase);

      const id = uuidv4();
      const metadata_private_keys = [decryptedMetadataPrivateKeyDto({metadata_key_id: id})];
      const apiMetadataKeysCollection = [defaultMetadataKeyDto({id, metadata_private_keys})];

      const service = new FindMetadataKeysService(apiClientOptions, account);
      const spyOnFindService = jest.spyOn(service.metadataKeysApiService, "findAll");
      spyOnFindService.mockImplementation(() => apiMetadataKeysCollection);

      const expectedError = new Error("The metadata private keys should not be decrypted.");
      await expect(() => service.findAllForSessionStorage()).rejects.toThrow(expectedError);
    });

    it("throws API error if the API encountered an issue", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys/, () => mockApiResponseError(500, "Something wrong happened!"));

      const service = new FindMetadataKeysService(apiClientOptions);

      await expect(() => service.findAllForSessionStorage()).rejects.toThrow(CipherguardApiFetchError);
    });

    it("throws service unavailable error if an error occurred but not from the API (by instance cloudflare)", async() => {
      expect.assertions(1);
      fetch.doMockOnceIf(/metadata\/keys/, () => { throw new Error("Service unavailable"); });

      const service = new FindMetadataKeysService(apiClientOptions);

      await expect(() => service.findAllForSessionStorage()).rejects.toThrow(CipherguardServiceUnavailableError);
    });
  });
});
