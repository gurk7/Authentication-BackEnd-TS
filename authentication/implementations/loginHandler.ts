import { ILoginHandler } from "../abstractions/ILoginHandler";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";
import { IUserAuthenticator } from "../abstractions/IUserAuthenticator";
import { ITokenCreator } from "../abstractions/ITokenCreator";
import { IAuthenticationResponseCreator } from "../abstractions/IAuthenticationResponseCreator";
import express = require('express');
import { IHttpResponseSender } from "../../common/abstractions/IHttpResponseSender";
import { SuccessAuthenticationHttpResponse } from "../entities/httpResponse/successAuthenticationHttpResponse";
import { FailedAuthenticationHttpResponse } from "../entities/httpResponse/failedAuthenticationHttpResponse";

export class LoginHandler implements ILoginHandler {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private userAuthenticator: IUserAuthenticator;
  private tokenCreator: ITokenCreator;
  private authenticationResponseCreator: IAuthenticationResponseCreator;
  private httpResponseSender: IHttpResponseSender;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    asyncUserAuthenticator: IUserAuthenticator,
    tokenCreator: ITokenCreator,
    authenticationResponseCreator: IAuthenticationResponseCreator,
    httpResponseSender: IHttpResponseSender
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.userAuthenticator = asyncUserAuthenticator;
    this.tokenCreator = tokenCreator;
    this.authenticationResponseCreator = authenticationResponseCreator;
    this.httpResponseSender = httpResponseSender;
  }

  public async handleLogin(req: express.Request, res: express.Response) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = await this.userAuthenticator.authenticate(
      inputUser
    );

    if (isUserAuthenticated) {
      let token = this.tokenCreator.create(inputUser);
      let successAuthenticationResponse = this.authenticationResponseCreator.createResponseForAuthenticatedUser(
        token
      );
      this.httpResponseSender.SendResponse<SuccessAuthenticationHttpResponse>(res, successAuthenticationResponse);

    } else {
      let failedAuthenticationResponse = this.authenticationResponseCreator.createResponseForUnAuthenticatedUser();
      this.httpResponseSender.SendResponse<FailedAuthenticationHttpResponse>(res, failedAuthenticationResponse);
    }
  }
}
