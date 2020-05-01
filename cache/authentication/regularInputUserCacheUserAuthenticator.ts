import { LoginRegularInputUser } from "../../authentication/entities/input/loginRegularInputUser";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";

export class RegularInputUserCacheUserAuthenticator implements IInputUserAuthenticator<LoginRegularInputUser> {
  private allowedUsers: LoginRegularInputUser[];

  constructor(allowedUsers: LoginRegularInputUser[]) {
    this.allowedUsers = allowedUsers;
  }

  async authenticate(inputUser: LoginRegularInputUser) {
    return await this.IsUserExists(inputUser);
  }

  private IsUserExists(inputUser: LoginRegularInputUser): boolean {
    for (let allowedUser of this.allowedUsers) {
      if (allowedUser.equals(inputUser)) {
        return true;
      }
    }
    return false;
  }
}
