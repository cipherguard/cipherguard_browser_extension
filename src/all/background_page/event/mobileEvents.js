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
 * @since         v3.2.0
 */
import MobileTransferModel from "../model/mobileTransfer/mobileTransferModel";
import TransferEntity from "../model/entity/transfer/transferEntity";

/**
 * Listens to the mobile events
 * @param {Worker} worker The worker
 * @param {ApiClientOptions} apiClientOptions The api client options
 */
const listen = function(worker, apiClientOptions) {
  /*
   * cipherguard.mobile.transfer.get
   *
   * @listens cipherguard.mobile.transfer.create
   * @param requestId {uuid} The request identifier
   * @param transferDto {object} The transfer data
   */
  worker.port.on('cipherguard.mobile.transfer.get', async(requestId, transferId) => {
    try {
      const transferModel = new MobileTransferModel(apiClientOptions);
      const transferEntity = await transferModel.get(transferId);
      worker.port.emit(requestId, 'SUCCESS', transferEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });

  /*
   * cipherguard.mobile.transfer.create
   *
   * @listens cipherguard.mobile.transfer.create
   * @param requestId {uuid} The request identifier
   * @param transferDto {object} The transfer data
   */
  worker.port.on('cipherguard.mobile.transfer.create', async(requestId, transferDto) => {
    try {
      const transferModel = new MobileTransferModel(apiClientOptions);
      const transferEntity = new TransferEntity(transferDto);
      const updatedTransferEntity = await transferModel.create(transferEntity);
      worker.port.emit(requestId, 'SUCCESS', updatedTransferEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });

  /*
   * cipherguard.mobile.transfer.update
   *
   * @listens cipherguard.mobile.transfer.update
   * @param requestId {uuid} The request identifier
   * @param transferDto {object} The transfer data
   */
  worker.port.on('cipherguard.mobile.transfer.update', async(requestId, transferDto) => {
    try {
      const transferModel = new MobileTransferModel(apiClientOptions);
      const transferEntity = new TransferEntity(transferDto);
      const updatedTransferEntity = await transferModel.update(transferEntity);
      worker.port.emit(requestId, 'SUCCESS', updatedTransferEntity);
    } catch (error) {
      worker.port.emit(requestId, 'ERROR', error);
    }
  });
};

export const MobileEvents = {listen};
