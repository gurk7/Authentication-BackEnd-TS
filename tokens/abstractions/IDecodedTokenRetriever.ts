import { DecodedJWTAuthenticatedUser } from "../../entities/authorization/decodedJWTAuthenticatedUser";

export interface IDecodedTokenRetriever {
  retrieveDecodedToken(req: any, res: any): undefined | DecodedJWTAuthenticatedUser;
}
