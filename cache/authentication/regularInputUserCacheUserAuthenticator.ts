import { RegularInputUser } from "../../authentication/entities/regularInputUser";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";

export class RegularInputUserCacheUserAuthenticator implements IInputUserAuthenticator<RegularInputUser> {
  private allowedUsers: RegularInputUser[];

  constructor(allowedUsers: RegularInputUser[]) {
    this.allowedUsers = allowedUsers;
  }

  async authenticate(inputUser: RegularInputUser) {
    return await this.IsUserExists(inputUser);
  }

  private IsUserExists(inputUser: RegularInputUser) : boolean
  {
    for (let allowedUser of this.allowedUsers) {
      if (allowedUser.equals(inputUser)) {
        return true;
      }
    }
    return false;
  }
}
