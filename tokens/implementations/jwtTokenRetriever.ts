import { ITokenRetriever } from "../abstractions/ITokenRetriever";
import { User } from "../../entities/user";
import jwt = require("jsonwebtoken");

export class JwtTokenRetriever implements ITokenRetriever {
  private secretOrPublicKey: string;
  private expirationTime: string;

  constructor(secretOrPublicKey: string, expirationTime: string) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.expirationTime = expirationTime;
  }

  retrieve(user: User) {
    return jwt.sign({ username: user.username }, this.secretOrPublicKey, {
      expiresIn: this.expirationTime
    });
  }
}
