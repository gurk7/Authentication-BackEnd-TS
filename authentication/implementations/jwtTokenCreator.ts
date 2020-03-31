import { ITokenCreator } from "../abstractions/ITokenCreator";
import { User } from "../entities/user";
import jwt = require("jsonwebtoken");

export class JwtTokenCreator implements ITokenCreator {
  private secretOrPublicKey: string;
  private expirationTime: string;

  constructor(secretOrPublicKey: string, expirationTime: string) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.expirationTime = expirationTime;
  }

  create(user: User) {
    return jwt.sign({ username: user.username }, this.secretOrPublicKey, {
      expiresIn: this.expirationTime
    });
  }
}
