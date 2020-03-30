import { User } from "../../common/entities/authentication/user";
import { ISyncUserAuthenticator } from "../../common/abstractions/authentication/ISyncUserAuthenticator";

export class CacheSyncUserAuthenticator implements ISyncUserAuthenticator {
  private allowedUsers: User[];

  constructor(allowedUsers: User[]) {
    this.allowedUsers = allowedUsers;
  }

  authenticate(inputUser: User) {
    for (let allowedUser of this.allowedUsers) {
      if (allowedUser.equals(inputUser)) {
        return true;
      }
    }
    return false;
  }
}
