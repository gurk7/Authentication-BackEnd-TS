import { User } from "../../common/entities/authentication/user";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";
import express = require('express');

export class UserFromRequestExtractor implements IUserFromRequestExtractor {
  extract(req: express.Request): User {
    let username: string = req.body.username;
    let password: string = req.body.password;

    return new User(username, password);
  }
}
