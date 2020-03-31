import { IUserAuthorizer } from "../../common/abstractions/IUserAuthorizer";
import { DecodedJWTAuthenticatedUser } from "../../common/entities/authorization/decodedJWTAuthenticatedUser";
import { IUserFinder } from "../../common/abstractions/IUserFinder";

export class ActiveDirectoryUserAuthorizer implements IUserAuthorizer {
  private activeDirectoryUserFinder: IUserFinder;

  constructor(activeDirectoryUserFinder: IUserFinder) {
    this.activeDirectoryUserFinder = activeDirectoryUserFinder;
  }

  async authorize(decodedUser: DecodedJWTAuthenticatedUser) {
    return await this.activeDirectoryUserFinder.find(decodedUser.username);
  }
}

