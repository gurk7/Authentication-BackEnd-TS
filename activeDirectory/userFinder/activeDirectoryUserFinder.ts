import { IUserFinder } from "../../common/abstractions/userFinder/IUserFinder";

export class ActiveDirectoryUserFinder implements IUserFinder {
  private activeDirectory: any;

  constructor(activeDirectory: any) {
    this.activeDirectory = activeDirectory;
  }

  async find(username: string) {
      let isUserInActiveDirectory: boolean = await this.activeDirectory.user(username).exists();
      console.log(`user: ${username} exists: ${isUserInActiveDirectory} in active directory`);
      
      return isUserInActiveDirectory;
  }
}

