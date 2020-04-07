import { IUserFinder } from "../../common/abstractions/IUserFinder";

export class ActiveDirectoryByGroupNameUserFinder implements IUserFinder {
  private activeDirectory: any;
  private groupName: string;

  constructor(activeDirectory: any, groupName: string) {
    this.activeDirectory = activeDirectory;
    this.groupName = groupName;
  }

  async find(username: string) {
    let isUserMemberOfGroup: boolean = await this.activeDirectory
    .user(username)
    .isMemberOf(this.groupName);

    console.log(`user ${username} `  + 
    `is member: ${isUserMemberOfGroup} of the group: ${this.groupName}`);
    
    return isUserMemberOfGroup;
  }
}

