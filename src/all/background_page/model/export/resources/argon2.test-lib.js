/**
 * Argon2 implementation for test provided by kdbxweb.
 *
 * @copyright     Copyright (c) kdbxweb
 * @license       https://opensource.org/licenses/MIT MIT License
 * @link          https://github.com/keeweb/kdbxweb/blob/1.9.0/test/test-support/argon2.js
 */
function argon2(password, salt, memory, iterations, length, parallelism, type, version) {
  const Module = require('./argon2-asm.min');
  const passwordLen = password.byteLength;
  password = Module.allocate(new Uint8Array(password), 'i8', Module.ALLOC_NORMAL);
  const saltLen = salt.byteLength;
  salt = Module.allocate(new Uint8Array(salt), 'i8', Module.ALLOC_NORMAL);
  const hash = Module.allocate(new Array(length), 'i8', Module.ALLOC_NORMAL);
  const encodedLen = 512;
  const encoded = Module.allocate(new Array(encodedLen), 'i8', Module.ALLOC_NORMAL);
  try {
    const res = Module._argon2_hash(
      iterations,
      memory,
      parallelism,
      password,
      passwordLen,
      salt,
      saltLen,
      hash,
      length,
      encoded,
      encodedLen,
      type,
      version
    );
    if (res) {
      return Promise.reject(`Argon2 error ${res}`);
    }
    const hashArr = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      hashArr[i] = Module.HEAP8[hash + i];
    }
    Module._free(password);
    Module._free(salt);
    Module._free(hash);
    Module._free(encoded);
    return Promise.resolve(hashArr);
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = argon2;
