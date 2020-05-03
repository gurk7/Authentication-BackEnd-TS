import { RegularLoginInputUser } from "../../../../authentication/entities/input/regularLoginInputUser";
import { IInputUserFromRequestExtractor } from "../../abstractions/request/IInputUserFromRequestExtractor";
import express = require('express');

export class RegularLoginInputUserFromRequestExtractor implements
  IInputUserFromRequestExtractor<RegularLoginInputUser> {

  extract(req: express.Request): RegularLoginInputUser {
    let username: string = req.body.username;
    let password: string = req.body.password;

    return new RegularLoginInputUser(username, password);
  }
}
