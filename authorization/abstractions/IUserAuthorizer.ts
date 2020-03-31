import { DecodedJWTAuthenticatedUser } from "../../common/entities/authorization/decodedJWTAuthenticatedUser";

export interface IUserAuthorizer {
    authorize(decodedUser: DecodedJWTAuthenticatedUser): Promise<boolean>;
}