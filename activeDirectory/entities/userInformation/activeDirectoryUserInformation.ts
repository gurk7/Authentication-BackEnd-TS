export class ActiveDirectoryUserInformation {
    firstName: string;
    lastName: string;
    email: string;
    groups: string[];
     
    constructor(firstName: string, lastName: string, email: string, groups: string[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.groups = groups;
    }
  }
  