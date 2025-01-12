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
 * @since         3.6.0
 */

import PostponeUserSettingInvitationController from "./postponeUserSettingInvitationController";
import PostponeUserSettingInvitationService from '../../service/invitation/postponeUserSettingInvitationService';

describe("PostponeUserSettingInvitationController", () => {
  it("can set the account recovery enrollment invitation as postponed", () => {
    expect.assertions(2);
    expect(PostponeUserSettingInvitationService.hasPostponedAccountRecovery()).toBe(false);

    const controller = new PostponeUserSettingInvitationController();
    controller.exec();

    expect(PostponeUserSettingInvitationService.hasPostponedAccountRecovery()).toBe(true);
  });
});
