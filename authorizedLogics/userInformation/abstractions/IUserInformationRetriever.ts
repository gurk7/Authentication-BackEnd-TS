import { RegularDecodedToken } from "../../../authorization/entities/regularDecodedToken";

export interface IUserInformationRetriever<T>{
    retrieve(authenticatedUser: RegularDecodedToken) : Promise<T>
}