import { IRESTLoginHandler } from "../abstractions/IRESTLoginHandler";
import { IInputUserFromRequestExtractor } from "../abstractions/request/IInputUserFromRequestExtractor";
import { IAuthenticationResponseCreator } from "../abstractions/response/IAuthenticationResponseCreator";
import { IHttpResponseSender } from "../../../common/abstractions/IHttpResponseSender";
import { FailedAuthenticationResponse } from "../entities/response/failedAuthenticationResponse";
import { Request, Response } from 'express';
import { HttpResponseStatusesConsts } from "../../../consts/httpResponseStatusesConsts";
import { IAuthenticationHandler } from "../../../authentication/abstractions/IAuthenticationHandler";
import { AuthenticationResponse } from "../../../authentication/entities/response/authenticationResponse";

export class TokenBasedRESTLoginHandler<TInputUser> implements IRESTLoginHandler {

  private inputUserFromRequestExtractor: IInputUserFromRequestExtractor<TInputUser>;
  private authenticationHandler: IAuthenticationHandler<TInputUser>;

  private authenticationResponseCreator: IAuthenticationResponseCreator;
  private httpResponseSender: IHttpResponseSender;

  constructor(
    inputUserFromRequestExtractor: IInputUserFromRequestExtractor<TInputUser>,
    authenticationHandler: IAuthenticationHandler<TInputUser>,
    authenticationResponseCreator: IAuthenticationResponseCreator,
    httpResponseSender: IHttpResponseSender
  ) {
    this.inputUserFromRequestExtractor = inputUserFromRequestExtractor;
    this.authenticationHandler = authenticationHandler;
    this.authenticationResponseCreator = authenticationResponseCreator;
    this.httpResponseSender = httpResponseSender;
  }

  public async handleLogin(req: Request, res: Response) {
    let inputUser = this.inputUserFromRequestExtractor.extract(req);

    try {
      let authenticationResponse = await this.authenticationHandler.handleAuthentication(inputUser);

      this.httpResponseSender.SendResponse<AuthenticationResponse>(res,
        authenticationResponse,
        HttpResponseStatusesConsts.success);
    }
    catch (error) {
      console.log("User is not authenticated. Username or password is incorrect");
      console.log(error);

      let failedAuthenticationResponse = this.authenticationResponseCreator
        .createResponseForUnAuthenticatedUser();

      this.httpResponseSender.SendResponse<FailedAuthenticationResponse>(res,
        failedAuthenticationResponse,
        HttpResponseStatusesConsts.unAuthorized);
    }
  }
}
