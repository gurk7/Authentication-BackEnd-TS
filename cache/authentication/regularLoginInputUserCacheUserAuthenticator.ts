import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";

export class RegularLoginInputUserCacheUserAuthenticator implements IInputUserAuthenticator<RegularLoginInputUser> {
  private allowedUsers: RegularLoginInputUser[];

  constructor(allowedUsers: RegularLoginInputUser[]) {
    this.allowedUsers = allowedUsers;
  }

  async authenticate(inputUser: RegularLoginInputUser) {
    return await this.IsUserExists(inputUser);
  }

  private IsUserExists(inputUser: RegularLoginInputUser): boolean {
    for (let allowedUser of this.allowedUsers) {
      if (allowedUser.equals(inputUser)) {
        return true;
      }
    }
    return false;
  }
}
