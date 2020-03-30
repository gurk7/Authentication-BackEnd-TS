import { DecodedJWTAuthenticatedUser } from "../../entities/authorization/decodedJWTAuthenticatedUser";

export interface IUserAuthorizer {
    authorize(decodedUser: DecodedJWTAuthenticatedUser): Promise<boolean>;
}