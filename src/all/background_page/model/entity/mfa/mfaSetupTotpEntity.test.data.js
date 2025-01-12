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
 * @since         4.4.0
 */

export const defaultSetupTotpData = (props = {}) => {
  const data = {
    otpProvisioningUri: "otpauth://totp/www.cipherguard.local:admin%40cipherguard.com?issuer=www.cipherguard.local&secret=TVWEGQFS3WPCID6GYAPHHCC54VXHFUL7EC5FVHEMVH7CKQI2XEQQ&algorithm=SHA1&digits=6&period=30",
    totp: "663516"
  };
  return Object.assign(data, props);
};

export const lowerCaseAlgorithmSetupTotpData = (props = {}) => {
  const data = {
    otpProvisioningUri: "otpauth://totp/www.cipherguard.local:admin%40cipherguard.com?issuer=www.cipherguard.local&secret=TVWEGQFS3WPCID6GYAPHHCC54VXHFUL7EC5FVHEMVH7CKQI2XEQQ&algorithm=sha1&digits=6&period=30",
    totp: "663516"
  };
  return Object.assign(data, props);
};
