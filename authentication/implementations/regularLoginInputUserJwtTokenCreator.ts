import { ITokenCreator } from "../abstractions/ITokenCreator";
import { RegularLoginInputUser } from "../entities/input/regularLoginInputUser";
import jwt = require("jsonwebtoken");

export class RegularLoginInputUserJwtTokenCreator implements ITokenCreator<RegularLoginInputUser> {
  private secretOrPublicKey: string;
  private expirationTime: string;

  constructor(secretOrPublicKey: string, expirationTime: string) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.expirationTime = expirationTime;
  }

  create(inputUser: RegularLoginInputUser) {
    return jwt.sign({ username: inputUser.username }, this.secretOrPublicKey, {
      expiresIn: this.expirationTime
    });
  }
}
