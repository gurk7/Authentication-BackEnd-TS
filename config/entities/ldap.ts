export class LDAPConfiguration {
    url: string;
    userFullyQualifiedDomainName: string;
    password: string;
  
    constructor(url: string, userFullyQualifiedDomainName: string, password: string) {
      this.url = url;
      this.userFullyQualifiedDomainName = userFullyQualifiedDomainName;
      this.password = password;
    }
  }
  