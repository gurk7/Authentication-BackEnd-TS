import { IUserInformationGetter } from "../abstractions/IUserInformationGetter";
import { IUserInformationRetriever } from "../abstractions/IUserInformationRetriever";
import { IDecodedTokenRetriever } from "../../../authorization/abstractions/tokens/IDecodedTokenRetriever";

export class UserInformationGetter<T> implements IUserInformationGetter<T>{
    private decodedTokenRetriever: IDecodedTokenRetriever;
    private userInformationRetriever: IUserInformationRetriever<T>;

    constructor(decodedTokenRetriever: IDecodedTokenRetriever, userInformationRetriever: IUserInformationRetriever<T>)
    {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userInformationRetriever = userInformationRetriever;
    }

    getUserInformation(req: any, res: any) {
        let decodedtoken = this.decodedTokenRetriever.retrieveDecodedToken(req);
        
        if(decodedtoken) 
        {
            return this.userInformationRetriever.retrieve(decodedtoken);
        }
    }

}