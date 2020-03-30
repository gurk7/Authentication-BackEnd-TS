import { DecodedJWTAuthenticatedUser } from "../../../common/entities/authorization/decodedJWTAuthenticatedUser";

export interface IUserInformationRetriever<T>{
    retrieve(authenticatedUser: DecodedJWTAuthenticatedUser) : Promise<T>
}