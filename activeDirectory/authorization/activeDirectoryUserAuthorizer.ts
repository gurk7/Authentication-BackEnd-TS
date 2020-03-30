import { IUserAuthorizer } from "../../common/abstractions/authorization/IUserAuthorizer";
import { DecodedJWTAuthenticatedUser } from "../../common/entities/authorization/decodedJWTAuthenticatedUser";
import { IUserFinder } from "../../common/abstractions/userFinder/IUserFinder";

export class ActiveDirectoryUserAuthorizer implements IUserAuthorizer {
  private activeDirectoryUserFinder: IUserFinder;

  constructor(activeDirectoryUserFinder: IUserFinder) {
    this.activeDirectoryUserFinder = activeDirectoryUserFinder;
  }

  async authorize(decodedUser: DecodedJWTAuthenticatedUser) {
    return this.activeDirectoryUserFinder.find(decodedUser.username);
  }
}

