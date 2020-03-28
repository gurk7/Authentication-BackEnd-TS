export class DecodedJWTAuthenticatedUser {
    username: string;
    iat: number;
    exp: number;
  
    constructor(username: string, iat: number, exp: number) {
      this.username = username;
      this.iat = iat;
      this.exp = exp;
    }
  }
  