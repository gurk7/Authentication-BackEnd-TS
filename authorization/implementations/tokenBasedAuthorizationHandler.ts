import { IAuthorizationHandler } from "../abstractions/IAuthorizationHandler";
import { IDecodedTokenRetriever } from '../abstractions/tokens/IDecodedTokenRetriever';
import { IUserAuthorizer } from "../abstractions/IUserAuthorizer";
import {IAuthorizationFailureResponseCreator} from '../abstractions/IAuthorizationFailureResponseCreator'
import { IHttpResponseSender } from "../../common/abstractions/IHttpResponseSender";
import { FailedAuthorizationResponse } from "../entities/response/failedAuthorizationResponse";
import express = require('express');
import { HttpResponseStatusesConsts } from "../../consts/httpResponseStatusesConsts";

export class TokenBasedAuthorizationHandler<TDecodedToken> implements IAuthorizationHandler {
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

    async handleAuthorization(req: express.Request, res: express.Response) {
        let decodedToken = this.decodedTokenRetriever.retrieveDecodedToken(req);

        if (decodedToken) {
            let isAuthorized = await this.userAuthorizer.authorize(decodedToken);
            console.log(`user is authorized: ${isAuthorized}`);

            if (isAuthorized) {
                return true;
            }
            else
            {                        
                //User is not authorized and flow can not be continued.
                let failedAuthorizationResponse = this.authorizationFailureHttpResponseCreator
                .createResponseForAuthenticatedUser(decodedToken);
                this.httpResponseSender.SendResponse<FailedAuthorizationResponse>(res, 
                    failedAuthorizationResponse, HttpResponseStatusesConsts.forbidden);
            }
        }
        else
        {
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