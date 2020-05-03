import { UserInformation } from "../../../authentication/entities/userInformation";

export interface IUserInformationRetriever<TDecodedToken> {
    retrieve(crrentUser: TDecodedToken): Promise<UserInformation>
}