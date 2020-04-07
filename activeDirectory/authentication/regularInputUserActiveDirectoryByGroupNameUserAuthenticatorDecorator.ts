import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { RegularInputUser } from "../../authentication/entities/regularInputUser";

export class RegularInputUserActiveDirectoryByGroupNameUserAuthenticatorDecorator
implements IInputUserAuthenticator<RegularInputUser> {

  private innerActiveDirectoryInputUserAuthenticator: IInputUserAuthenticator<RegularInputUser>;
  private activeDirectoryGroupMemberUserFinder: IUserFinder;

  constructor(innerActiveDirectoryInputUserAuthenticator: IInputUserAuthenticator<RegularInputUser>, 
    activeDirectoryGroupMemberUserFinder: IUserFinder) {
    this.innerActiveDirectoryInputUserAuthenticator = innerActiveDirectoryInputUserAuthenticator;
    this.activeDirectoryGroupMemberUserFinder = activeDirectoryGroupMemberUserFinder;  
  }

  async authenticate(inputUser: RegularInputUser) {
      let isUserAuthenticatedInActiveDirectory = 
        await this.innerActiveDirectoryInputUserAuthenticator.authenticate(inputUser);

      if(!isUserAuthenticatedInActiveDirectory) return false;

      return await this.activeDirectoryGroupMemberUserFinder.find(inputUser.username);
      
  }
}

