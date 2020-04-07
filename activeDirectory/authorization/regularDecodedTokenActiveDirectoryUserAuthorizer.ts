import { IUserAuthorizer } from "../../authorization/abstractions/IUserAuthorizer";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { IUserFinder } from "../../common/abstractions/IUserFinder";

export class RegularDecodedTokenActiveDirectoryUserAuthorizer implements IUserAuthorizer<RegularDecodedToken> {
  private activeDirectoryUserFinder: IUserFinder;

  constructor(activeDirectoryUserFinder: IUserFinder) {
    this.activeDirectoryUserFinder = activeDirectoryUserFinder;
  }

  async authorize(decodedToken: RegularDecodedToken) {
    return await this.activeDirectoryUserFinder.find(decodedToken.username);
  }
}

