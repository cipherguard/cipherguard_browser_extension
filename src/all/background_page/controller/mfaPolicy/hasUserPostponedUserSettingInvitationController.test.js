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
 * @since         3.10.0
 */

import PostponeUserSettingInvitationService from "../../service/invitation/postponeUserSettingInvitationService";
import HasUserPostponedUserSettingInvitationController from "./hasUserPostponedUserSettingInvitationController";

describe("hasUserPostponedUserSettingInvitationController", () => {
  it("can get the mfa enrollment invitation status", () => {
    expect.assertions(2);
    const controller = new HasUserPostponedUserSettingInvitationController();
    const defaultValue = controller.exec();

    expect(defaultValue).toBe(false);

    PostponeUserSettingInvitationService.postponeMFAPolicy();

    const setValue = controller.exec();
    expect(setValue).toBe(true);
  });
});

