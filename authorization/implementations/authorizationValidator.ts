import { IAuthorizationValidator } from "../abstractions/IAuthorizationValidator";
import {IDecodedTokenRetriever} from '../../tokens/abstractions/IDecodedTokenRetriever';
import {IUserAuthorizer} from '../abstractions/IUserAuthorizer';

export class AuthorizationValidator implements IAuthorizationValidator{
    private decodedTokenRetriever: IDecodedTokenRetriever;
    private userAuthorizer: IUserAuthorizer;

    constructor(decodedTokenRetriever: IDecodedTokenRetriever, userAuthorizer: IUserAuthorizer){
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userAuthorizer = userAuthorizer;
    }

    async validateAuthorization(req: any, res: any){
        let decodedtoken = this.decodedTokenRetriever.retrieveDecodedToken(req, res);
        
        if(decodedtoken)
        {
            return await this.userAuthorizer.authorize(decodedtoken);
        }
        return false;
    }
}