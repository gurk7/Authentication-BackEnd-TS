import { User } from "../entities/user";
import express = require('express');

export interface IAuthenticationHttpResponseCreator {
  createResponseForAuthenticatedUser(
    authonticatedUser: User,
    token: string,
    res: express.Response
  ): void;

  createResponseForUnAuthenticatedUser(
    unAuthenticatedUser: User,
    res: express.Response
  ): void;
}
