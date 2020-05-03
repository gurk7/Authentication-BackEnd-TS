import { IUserInformationGetter } from "../abstractions/IUserInformationGetter";
import { IUserInformationRetriever } from "../abstractions/IUserInformationRetriever";
import { IDecodedTokenRetriever } from "../../../REST/authorization/abstractions/request/IDecodedTokenRetriever";

export class UserInformationGetter<T> implements IUserInformationGetter<T>{
    private decodedTokenRetriever: IDecodedTokenRetriever<T>;
    private userInformationRetriever: IUserInformationRetriever<T>;

    constructor(decodedTokenRetriever: IDecodedTokenRetriever<T>, userInformationRetriever: IUserInformationRetriever<T>) {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userInformationRetriever = userInformationRetriever;
    }

    getUserInformation(req: any, res: any) {
        let decodedtoken = this.decodedTokenRetriever.retrieveDecodedToken(req);

        if (decodedtoken) {
            return this.userInformationRetriever.retrieve(decodedtoken);
        }
    }

}