import { RegularInputUser } from "../entities/regularInputUser";
import { IInputUserFromRequestExtractor } from "../abstractions/IInputUserFromRequestExtractor";
import express = require('express');

export class RegularInputUserFromRequestExtractor implements 
IInputUserFromRequestExtractor<RegularInputUser> {
  
  extract(req: express.Request): RegularInputUser {
    let username: string = req.body.username;
    let password: string = req.body.password;

    return new RegularInputUser(username, password);
  }
}
