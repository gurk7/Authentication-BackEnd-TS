import { IUserAuthorizer } from "../../../authorization/abstractions/IUserAuthorizer";
import { IHttpResponseSender } from "../../../common/abstractions/IHttpResponseSender";
import { HttpResponseStatusesConsts } from "../../../consts/httpResponseStatusesConsts";
import { Request, Response } from 'express';
import { IRESTAuthorizationHandler } from "../abstractions/IRESTAuthorizationHandler";
import { IDecodedTokenRetriever } from "../abstractions/request/IDecodedTokenRetriever";
import { IAuthorizationFailureResponseCreator } from "../abstractions/response/IAuthorizationFailureResponseCreator";
import { FailedAuthenticationResponse } from "../../authentication/entities/response/failedAuthenticationResponse";

export class TokenBasedAuthorizationHandler<TDecodedToken> implements IRESTAuthorizationHandler {
    private decodedTokenRetriever: IDecodedTokenRetriever<TDecodedToken>;
    private userAuthorizer: IUserAuthorizer<TDecodedToken>;
    private authorizationFailureHttpResponseCreator: IAuthorizationFailureResponseCreator<TDecodedToken>;
    private httpResponseSender: IHttpResponseSender;

    constructor(
        decodedTokenRetriever: IDecodedTokenRetriever<TDecodedToken>,
        userAuthorizer: IUserAuthorizer<TDecodedToken>,
        authorizationFailureHttpResponseCreator: IAuthorizationFailureResponseCreator<TDecodedToken>,

        httpResponseSender: IHttpResponseSender) {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userAuthorizer = userAuthorizer;
        this.authorizationFailureHttpResponseCreator = authorizationFailureHttpResponseCreator;
        this.httpResponseSender = httpResponseSender;
    }

    async handleAuthorization(req: Request, res: Response): Promise<boolean> {
        let decodedToken = this.decodedTokenRetriever.retrieveDecodedToken(req);

        if (decodedToken) {
            let isAuthorized = await this.userAuthorizer.authorize(decodedToken);
            console.log(`user is authorized: ${isAuthorized}`);

            if (isAuthorized) {
                return true;
            }
            else {
                //User is not authorized and flow can not be continued.
                let failedAuthorizationResponse = this.authorizationFailureHttpResponseCreator
                    .createResponseForAuthenticatedUser(decodedToken);
                this.httpResponseSender.SendResponse<FailedAuthenticationResponse>(res,
                    failedAuthorizationResponse, HttpResponseStatusesConsts.forbidden);
            }
        }
        else {
            //Received a token that does not match the secret key. Therefore, Token can not be decoded.    
            let failedAuthorizationResponse = this.authorizationFailureHttpResponseCreator
                .createResponseForUnAuthenticatedUser();
            this.httpResponseSender.SendResponse<FailedAuthorizationResponse>(res,
                failedAuthorizationResponse, HttpResponseStatusesConsts.forbidden);
        }

        //Authorization Failure
        return false;
    }
}