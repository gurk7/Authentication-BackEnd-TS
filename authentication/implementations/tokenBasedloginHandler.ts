import { ILoginHandler } from "../abstractions/ILoginHandler";
import { IInputUserFromRequestExtractor } from "../abstractions/IInputUserFromRequestExtractor";
import { IInputUserAuthenticator } from "../abstractions/IInputUserAuthenticator";
import { ITokenCreator } from "../abstractions/ITokenCreator";
import { IAuthenticationResponseCreator } from "../abstractions/IAuthenticationResponseCreator";
import { IHttpResponseSender } from "../../common/abstractions/IHttpResponseSender";
import { SuccessAuthenticationResponse } from "../entities/response/successAuthenticationResponse";
import { FailedAuthenticationResponse } from "../entities/response/failedAuthenticationResponse";
import express = require('express');
import { HttpResponseStatusesConsts } from "../../consts/httpResponseStatusesConsts";

export class TokenBasedLoginHandler<TInputUser> implements ILoginHandler {

  private inputUserFromRequestExtractor: IInputUserFromRequestExtractor<TInputUser>;
  private inputUserAuthenticator: IInputUserAuthenticator<TInputUser>;
  private tokenCreator: ITokenCreator<TInputUser>;
  
  private authenticationResponseCreator: IAuthenticationResponseCreator;
  private httpResponseSender: IHttpResponseSender;

  constructor(
    inputUserFromRequestExtractor: IInputUserFromRequestExtractor<TInputUser>,
    inputUserAuthenticator: IInputUserAuthenticator<TInputUser>,
    tokenCreator: ITokenCreator<TInputUser>,
    authenticationResponseCreator: IAuthenticationResponseCreator,
    httpResponseSender: IHttpResponseSender
  ) {
    this.inputUserFromRequestExtractor = inputUserFromRequestExtractor;
    this.inputUserAuthenticator = inputUserAuthenticator;
    this.tokenCreator = tokenCreator;
    this.authenticationResponseCreator = authenticationResponseCreator;
    this.httpResponseSender = httpResponseSender;
  }

  public async handleLogin(req: express.Request, res: express.Response) {
    let inputUser = this.inputUserFromRequestExtractor.extract(req);

    let isUserAuthenticated = await this.inputUserAuthenticator.authenticate(
      inputUser
    );

    if (isUserAuthenticated) {
      let token = this.tokenCreator.create(inputUser);
      let successAuthenticationResponse = this.authenticationResponseCreator.createResponseForAuthenticatedUser(
        token
      );
      
      this.httpResponseSender.SendResponse<SuccessAuthenticationResponse>(res, 
        successAuthenticationResponse, 
        HttpResponseStatusesConsts.success);
    }
    else {
      let failedAuthenticationResponse = this.authenticationResponseCreator.createResponseForUnAuthenticatedUser();

      this.httpResponseSender.SendResponse<FailedAuthenticationResponse>(res, 
        failedAuthenticationResponse, 
        HttpResponseStatusesConsts.unAuthorized);
    }
  }
}
