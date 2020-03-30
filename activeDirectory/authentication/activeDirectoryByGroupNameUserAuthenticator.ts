import { IAsyncUserAuthenticator } from "../../common/abstractions/authentication/IAsyncUserAuthenticator";
import { User } from "../../entities/authentication/user";
import { IUserFinder } from "../../common/abstractions/userFinder/IUserFinder";

export class ActiveDirectoryByGroupNameUserAuthenticatorDecorator implements IAsyncUserAuthenticator {
  private innerActiveDirectoryUserAuthenticator: IAsyncUserAuthenticator;
  private activeDirectoryGroupMemberUserFinder: IUserFinder;

  constructor(innerActiveDirectoryUserAuthenticator: IAsyncUserAuthenticator, activeDirectoryGroupMemberUserFinder: IUserFinder) {
    this.innerActiveDirectoryUserAuthenticator = innerActiveDirectoryUserAuthenticator;
    this.activeDirectoryGroupMemberUserFinder = activeDirectoryGroupMemberUserFinder;  
  }

  async authenticate(inputUser: User) {
      let isUserAuthenticatedInActiveDirectory = await this.innerActiveDirectoryUserAuthenticator.authenticate(inputUser);
      if(!isUserAuthenticatedInActiveDirectory) return false;
      
      return await this.activeDirectoryGroupMemberUserFinder.find(inputUser.username);
      
  }
}

