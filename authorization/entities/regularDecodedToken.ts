export class RegularDecodedToken {
    username: string;
    issuedAt: number;
    expirationTime: number;
  
    constructor(username: string, iat: number, exp: number) {
      this.username = username;
      this.issuedAt = iat;
      this.expirationTime = exp;
    }
  }
  