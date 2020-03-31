import { IUserAuthenticator } from "../../authentication/abstractions/IUserAuthenticator";
import { User } from "../../common/entities/authentication/user";
import { IUserFinder } from "../../common/abstractions/IUserFinder";

export class ActiveDirectoryByGroupNameUserAuthenticatorDecorator implements IUserAuthenticator {
  private innerActiveDirectoryUserAuthenticator: IUserAuthenticator;
  private activeDirectoryGroupMemberUserFinder: IUserFinder;

  constructor(innerActiveDirectoryUserAuthenticator: IUserAuthenticator, activeDirectoryGroupMemberUserFinder: IUserFinder) {
    this.innerActiveDirectoryUserAuthenticator = innerActiveDirectoryUserAuthenticator;
    this.activeDirectoryGroupMemberUserFinder = activeDirectoryGroupMemberUserFinder;  
  }

  async authenticate(inputUser: User) {
      let isUserAuthenticatedInActiveDirectory = await this.innerActiveDirectoryUserAuthenticator.authenticate(inputUser);
      if(!isUserAuthenticatedInActiveDirectory) return false;

      return await this.activeDirectoryGroupMemberUserFinder.find(inputUser.username);
      
  }
}

