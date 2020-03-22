import { User } from "../../entities/user";
import { ISyncUserRetriever } from "../abstractions/ISyncUserRetriever";

export class CacheSyncUserRetriever implements ISyncUserRetriever {
  private allowedUsers: User[];

  constructor(allowedUsers: User[]) {
    this.allowedUsers = allowedUsers;
  }

  RetrieveUser(username: string, password: string) {
    for (let user of this.allowedUsers) {
      if (user.username === username && user.password === password) {
        return user;
      }
    }
    return null;
  }
}
