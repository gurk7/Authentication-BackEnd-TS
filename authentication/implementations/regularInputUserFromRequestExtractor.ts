import { LoginRegularInputUser } from "../entities/input/loginRegularInputUser";
import { IInputUserFromRequestExtractor } from "../abstractions/IInputUserFromRequestExtractor";
import express = require('express');

export class RegularInputUserFromRequestExtractor implements
  IInputUserFromRequestExtractor<LoginRegularInputUser> {

  extract(req: express.Request): LoginRegularInputUser {
    let username: string = req.body.username;
    let password: string = req.body.password;

    return new LoginRegularInputUser(username, password);
  }
}
