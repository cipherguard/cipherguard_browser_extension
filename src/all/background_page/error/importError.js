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
 */
class ImportError extends Error {
  constructor(message, data, sourceError) {
    super(message);
    this.name = 'ImportError';
    this.data = data;
    this.sourceError = sourceError || {};
  }

  toJSON() {
    const sourceError = (this.sourceError && typeof this.sourceError.toJSON === "function")
      ? this.sourceError.toJSON()
      : this.sourceError;
    const data = (this.data && typeof this.data.toJSON === "function")
      ? this.data.toJSON()
      : this.data;

    return {
      name: this.name,
      message: this.message,
      data: data,
      sourceError: sourceError
    };
  }
}

export default ImportError;
