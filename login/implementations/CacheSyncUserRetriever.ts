import { User } from "../../entities/user";
import { ISyncUserRetriever } from "../abstractions/ISyncUserRetriever";

export class MongoDBAsyncUserRetriever implements ISyncUserRetriever {
  private allowedUser: User;

  constructor(allowedUser: User) {
    this.allowedUser = allowedUser;
  }

  RetrieveUser(username: string, password: string) {
    if (
      this.allowedUser.username === username &&
      this.allowedUser.password === password
    ) {
      return this.allowedUser;
    }
    return null;
  }
}
