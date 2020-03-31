import { IAuthenticationHttpResponseCreator } from "../abstractions/IAuthenticationHttpResponseCreator";
import { User } from "../entities/user";
import express = require('express');

export class AuthenticationHttpResponseCreator
  implements IAuthenticationHttpResponseCreator {
  createResponseForAuthenticatedUser(
    authonticatedUser: User,
    token: string,
    res: express.Response
  ) {
    console.log(
      `retrieved for authenticated user: ${authonticatedUser.username} the token: ${token} `
    );

    res.json({
      success: true,
      message: "Authentication successful!",
      token: token
    });
  }

  createResponseForUnAuthenticatedUser(unauthenticatedUser: User, res: express.Response) {
    console.log(
      `can't retrieve token for unauthenticated user: ${unauthenticatedUser.username}`
    );
    res.json({
      success: false,
      message: "Authenctication Failed! username or password is incorrect"
    });
  }
}
