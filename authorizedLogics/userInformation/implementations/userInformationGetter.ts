import { IUserInformationGetter } from "../abstractions/IUserInformationGetter";
import { IUserInformationRetriever } from "../abstractions/IUserInformationRetriever";
import { IDecodedTokenRetriever } from "../../../REST/authorization/abstractions/request/IDecodedTokenRetriever";
import { UserInformation } from "../../../authentication/entities/userInformation";
import { Request } from "express";

export class UserInformationGetter<T> implements IUserInformationGetter {
    private decodedTokenRetriever: IDecodedTokenRetriever<T>;
    private userInformationRetriever: IUserInformationRetriever<T>;

    constructor(decodedTokenRetriever: IDecodedTokenRetriever<T>, userInformationRetriever: IUserInformationRetriever<T>) {
        this.decodedTokenRetriever = decodedTokenRetriever;
        this.userInformationRetriever = userInformationRetriever;
    }

    getUserInformation(req: Request): Promise<UserInformation> {
        let decodedtoken = this.decodedTokenRetriever.retrieveDecodedToken(req);
        return this.userInformationRetriever.retrieve(decodedtoken);
    }
}