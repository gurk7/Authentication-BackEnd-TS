import { DecodedJWTAuthenticatedUser } from "../../../common/entities/authorization/decodedJWTAuthenticatedUser";

export interface IDecodedTokenRetriever {
  retrieveDecodedToken(req: any): DecodedJWTAuthenticatedUser | undefined;
}
