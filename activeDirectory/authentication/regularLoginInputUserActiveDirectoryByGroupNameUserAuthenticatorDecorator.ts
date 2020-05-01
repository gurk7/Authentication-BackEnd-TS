import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";

export class RegularLoginInputUserActiveDirectoryByGroupNameUserAuthenticatorDecorator
  implements IInputUserAuthenticator<RegularLoginInputUser> {

  private innerActiveDirectoryInputUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser>;
  private activeDirectoryGroupMemberUserFinder: IUserFinder;

  constructor(innerActiveDirectoryInputUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser>,
    activeDirectoryGroupMemberUserFinder: IUserFinder) {
    this.innerActiveDirectoryInputUserAuthenticator = innerActiveDirectoryInputUserAuthenticator;
    this.activeDirectoryGroupMemberUserFinder = activeDirectoryGroupMemberUserFinder;
  }

  async authenticate(inputUser: RegularLoginInputUser) {
    let isUserAuthenticatedInActiveDirectory =
      await this.innerActiveDirectoryInputUserAuthenticator.authenticate(inputUser);

    if (!isUserAuthenticatedInActiveDirectory) return false;

    return await this.activeDirectoryGroupMemberUserFinder.find(inputUser.username);

  }
}

