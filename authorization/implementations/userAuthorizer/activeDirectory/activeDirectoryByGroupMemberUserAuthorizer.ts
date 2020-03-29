import { DecodedJWTAuthenticatedUser } from "../../../../entities/authorization/decodedJWTAuthenticatedUser";
import { IUserAuthorizer } from "../../../abstractions/userAuthorizer/IUserAuthorizer";

//Authenticate a user by validating that he is in a specific group in active directory
export class ActiveDirectoryByGroupMemberUserAuthorizer implements IUserAuthorizer {
  private activeDirectory: any;
  private groupName: string;

  constructor(activeDirectory: any, groupName: string) {
    this.activeDirectory = activeDirectory;
    this.groupName = groupName;
  }

  async authorize(decodedJWTAuthenticatedUser: DecodedJWTAuthenticatedUser) {
      let isUserMemberOfGroup: boolean = await this.activeDirectory
      .user(decodedJWTAuthenticatedUser.username)
      .isMemberOf(this.groupName);

      console.log(`user ${decodedJWTAuthenticatedUser.username} `  + 
      `is member: ${isUserMemberOfGroup} of the group: ${this.groupName}`);
      
      return isUserMemberOfGroup;
  }
}

