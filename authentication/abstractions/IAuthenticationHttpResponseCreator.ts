import { User } from "../../common/entities/authentication/user";
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
