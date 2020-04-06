import { ILoginHandler } from "../abstractions/ILoginHandler";
import { IInputUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";
import { IUserAuthenticator } from "../abstractions/IUserAuthenticator";
import { ITokenCreator } from "../abstractions/ITokenCreator";
import { IAuthenticationResponseCreator } from "../abstractions/IAuthenticationResponseCreator";
import { IHttpResponseSender } from "../../common/abstractions/IHttpResponseSender";
import { SuccessAuthenticationResponse } from "../entities/response/successAuthenticationResponse";
import { FailedAuthenticationResponse } from "../entities/response/failedAuthenticationResponse";
import express = require('express');

export class TokenBasedLoginHandler<TInputUser> implements ILoginHandler {

  private userFromRequestExtractor: IInputUserFromRequestExtractor<TInputUser>;
  private userAuthenticator: IUserAuthenticator<TInputUser>;
  private tokenCreator: ITokenCreator<TInputUser>;
  
  private authenticationResponseCreator: IAuthenticationResponseCreator;
  private httpResponseSender: IHttpResponseSender;

  constructor(
    userFromRequestExtractor: IInputUserFromRequestExtractor<TInputUser>,
    userAuthenticator: IUserAuthenticator<TInputUser>,
    tokenCreator: ITokenCreator<TInputUser>,
    authenticationResponseCreator: IAuthenticationResponseCreator,
    httpResponseSender: IHttpResponseSender
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.userAuthenticator = userAuthenticator;
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
      this.httpResponseSender.SendResponse<SuccessAuthenticationResponse>(res, successAuthenticationResponse);
    }
    else {
      let failedAuthenticationResponse = this.authenticationResponseCreator.createResponseForUnAuthenticatedUser();
      this.httpResponseSender.SendResponse<FailedAuthenticationResponse>(res, failedAuthenticationResponse);
    }
  }
}
