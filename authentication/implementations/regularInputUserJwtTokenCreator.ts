import { ITokenCreator } from "../abstractions/ITokenCreator";
import { RegularInputUser } from "../entities/regularInputUser";
import jwt = require("jsonwebtoken");

export class RegularInputUserJwtTokenCreator implements ITokenCreator<RegularInputUser> {
  private secretOrPublicKey: string;
  private expirationTime: string;

  constructor(secretOrPublicKey: string, expirationTime: string) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.expirationTime = expirationTime;
  }

  create(inputUser: RegularInputUser) {
    return jwt.sign({ username: inputUser.username }, this.secretOrPublicKey, {
      expiresIn: this.expirationTime
    });
  }
}
