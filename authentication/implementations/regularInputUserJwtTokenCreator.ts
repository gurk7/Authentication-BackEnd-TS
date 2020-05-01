import { ITokenCreator } from "../abstractions/ITokenCreator";
import { LoginRegularInputUser } from "../entities/input/loginRegularInputUser";
import jwt = require("jsonwebtoken");

export class RegularInputUserJwtTokenCreator implements ITokenCreator<LoginRegularInputUser> {
  private secretOrPublicKey: string;
  private expirationTime: string;

  constructor(secretOrPublicKey: string, expirationTime: string) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.expirationTime = expirationTime;
  }

  create(inputUser: LoginRegularInputUser) {
    return jwt.sign({ username: inputUser.username }, this.secretOrPublicKey, {
      expiresIn: this.expirationTime
    });
  }
}
