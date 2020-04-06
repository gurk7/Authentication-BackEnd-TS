import { IUserAuthenticator } from "../../authentication/abstractions/IUserAuthenticator";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { RegularInputUser } from "../../authentication/entities/regularInputUser";

export class RegularInputUserActiveDirectoryByGroupNameUserAuthenticatorDecorator
implements IUserAuthenticator<RegularInputUser> {

  private innerActiveDirectoryUserAuthenticator: IUserAuthenticator<RegularInputUser>;
  private activeDirectoryGroupMemberUserFinder: IUserFinder;

  constructor(innerActiveDirectoryUserAuthenticator: IUserAuthenticator<RegularInputUser>, 
    activeDirectoryGroupMemberUserFinder: IUserFinder) {
    this.innerActiveDirectoryUserAuthenticator = innerActiveDirectoryUserAuthenticator;
    this.activeDirectoryGroupMemberUserFinder = activeDirectoryGroupMemberUserFinder;  
  }

  async authenticate(inputUser: RegularInputUser) {
      let isUserAuthenticatedInActiveDirectory = 
        await this.innerActiveDirectoryUserAuthenticator.authenticate(inputUser);

      if(!isUserAuthenticatedInActiveDirectory) return false;

      return await this.activeDirectoryGroupMemberUserFinder.find(inputUser.username);
      
  }
}

