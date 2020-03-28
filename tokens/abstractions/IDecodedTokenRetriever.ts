import { DecodedJWTAuthenticatedUser } from "../../entities/authorization/decodedJWTAuthenticatedUser";

export interface IDecodedTokenRetriever {
  retrieveDecodedToken(req: any): DecodedJWTAuthenticatedUser | undefined;
}
