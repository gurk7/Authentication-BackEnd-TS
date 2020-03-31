import { DecodedJWTAuthenticatedUser } from "../entities/decodedJWTAuthenticatedUser";

export interface IUserAuthorizer {
    authorize(decodedUser: DecodedJWTAuthenticatedUser): Promise<boolean>;
}