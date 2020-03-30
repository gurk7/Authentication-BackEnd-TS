import { IAuthorizationHandler } from "../abstractions/IAuthorizationHandler";
import { IDecodedTokenRetriever } from '../abstractions/tokens/IDecodedTokenRetriever';
import { IUserAuthorizer } from "../../common/abstractions/authorization/IUserAuthorizer";
import {IAuthorizationFailureHttpResponseCreator} from '../abstractions/IAuthorizationFailureHttpResponseCreator'

export class AuthorizationHandler implements IAuthorizationHandler {
    private decodedTokenRetriever: IDecodedTokenRetriever;
    private userAuthorizer: IUserAuthorizer;
    private authorizationFailureHttpResponseCreator: IAuthorizationFailureHttpResponseCreator;

    constructor(
        decodedTokenRetriever: IDecodedTokenRetriever, 
        userAuthorizer: IUserAuthorizer,
        authorizationFailureHttpResponseCreator: IAuthorizationFailureHttpResponseCreator) {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userAuthorizer = userAuthorizer;
        this.authorizationFailureHttpResponseCreator = authorizationFailureHttpResponseCreator;
    }

    async handleAuthorization(req: any, res: any, next: any) {
        let decodedtoken = this.decodedTokenRetriever.retrieveDecodedToken(req);

        if (decodedtoken) {
            let isAuthorized = await this.userAuthorizer.authorize(decodedtoken);
            console.log(`user: ${decodedtoken.username} is authorized: ${isAuthorized}`);

            if (isAuthorized) {
                //User is authorized. calling to a delegate for the continual flow.
                next();
            }
            else
            {                        
                //User is not authorized and flow can not be continued.
                this.authorizationFailureHttpResponseCreator.createResponseForAuthenticatedUser(decodedtoken, res);
            }
        }
        else
        {
            //Received a token that does not match the secret key. Therefore, Token can not be decoded.    
            this.authorizationFailureHttpResponseCreator.createResponseForUnAuthenticatedUser(res);
        }
    }
}