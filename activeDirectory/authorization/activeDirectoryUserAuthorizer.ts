import { IUserAuthorizer } from "../../authorization/abstractions/IUserAuthorizer";
import { DecodedJWTAuthenticatedUser } from "../../authorization/entities/decodedJWTAuthenticatedUser";
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

