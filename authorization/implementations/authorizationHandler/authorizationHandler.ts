import { IAuthorizationHandler } from "../../abstractions/authorizationHandler/IAuthorizationHandler";
import { IDecodedTokenRetriever } from '../../abstractions/tokens/IDecodedTokenRetriever';
import { IUserAuthorizer } from '../../abstractions/userAuthorizer/IUserAuthorizer';

export class AuthorizationHandler implements IAuthorizationHandler {
    private decodedTokenRetriever: IDecodedTokenRetriever;
    private userAuthorizer: IUserAuthorizer;

    constructor(decodedTokenRetriever: IDecodedTokenRetriever, userAuthorizer: IUserAuthorizer) {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userAuthorizer = userAuthorizer;
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
                res.json({
                    success: false,
                    message: `User ${decodedtoken.username} is not authorized`
                });
            }
        }
        else
        {
            //Received a token that does not match the secret key. Therefore, Token can not be decoded.    
            res.json({
                success: false,
                message: "Can not decode the specified token. check you token's signature (when using JWT)"
            });
        }
    }
}