import { DecodedJWTAuthenticatedUser } from "../../../authorization/entities/decodedJWTAuthenticatedUser";

export interface IUserInformationRetriever<T>{
    retrieve(authenticatedUser: DecodedJWTAuthenticatedUser) : Promise<T>
}