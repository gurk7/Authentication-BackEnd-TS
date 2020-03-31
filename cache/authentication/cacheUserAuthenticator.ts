import { User } from "../../common/entities/authentication/user";
import { IUserAuthenticator } from "../../common/abstractions/IUserAuthenticator";

export class CacheSyncUserAuthenticator implements IUserAuthenticator {
  private allowedUsers: User[];

  constructor(allowedUsers: User[]) {
    this.allowedUsers = allowedUsers;
  }

  async authenticate(inputUser: User) {
    return await this.IsUserExists(inputUser);
  }

  private IsUserExists(inputUser: User) : boolean
  {
    for (let allowedUser of this.allowedUsers) {
      if (allowedUser.equals(inputUser)) {
        return true;
      }
    }
    return false;
  }
}
