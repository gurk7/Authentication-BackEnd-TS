import { IAuthorizationHandler } from "../abstractions/IAuthorizationHandler";
import { IDecodedTokenRetriever } from '../../tokens/abstractions/IDecodedTokenRetriever';
import { IUserAuthorizer } from '../abstractions/IUserAuthorizer';

export class AuthorizationHandler implements IAuthorizationHandler {
    private decodedTokenRetriever: IDecodedTokenRetriever;
    private userAuthorizer: IUserAuthorizer;

    constructor(decodedTokenRetriever: IDecodedTokenRetriever, userAuthorizer: IUserAuthorizer) {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userAuthorizer = userAuthorizer;
    }

    async handleAuthorization(req: any, res: any, next: any) {
        let decodedtoken = this.decodedTokenRetriever.retrieveDecodedToken(req, res);

        if (decodedtoken) {
            let isAuthorized = await this.userAuthorizer.authorize(decodedtoken);

            if (isAuthorized) {
                next();
                return;
            }
        }
        //In case token could not be decoded or user is not authorized
        res.json({
            success: false,
            message: "User is not authorized"
        });
    }
}