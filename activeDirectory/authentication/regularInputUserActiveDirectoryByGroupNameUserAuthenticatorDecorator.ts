import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { LoginRegularInputUser } from "../../authentication/entities/input/loginRegularInputUser";

export class RegularInputUserActiveDirectoryByGroupNameUserAuthenticatorDecorator
  implements IInputUserAuthenticator<LoginRegularInputUser> {

  private innerActiveDirectoryInputUserAuthenticator: IInputUserAuthenticator<LoginRegularInputUser>;
  private activeDirectoryGroupMemberUserFinder: IUserFinder;

  constructor(innerActiveDirectoryInputUserAuthenticator: IInputUserAuthenticator<LoginRegularInputUser>,
    activeDirectoryGroupMemberUserFinder: IUserFinder) {
    this.innerActiveDirectoryInputUserAuthenticator = innerActiveDirectoryInputUserAuthenticator;
    this.activeDirectoryGroupMemberUserFinder = activeDirectoryGroupMemberUserFinder;
  }

  async authenticate(inputUser: LoginRegularInputUser) {
    let isUserAuthenticatedInActiveDirectory =
      await this.innerActiveDirectoryInputUserAuthenticator.authenticate(inputUser);

    if (!isUserAuthenticatedInActiveDirectory) return false;

    return await this.activeDirectoryGroupMemberUserFinder.find(inputUser.username);

  }
}

