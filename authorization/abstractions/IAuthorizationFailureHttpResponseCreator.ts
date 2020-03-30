import { DecodedJWTAuthenticatedUser } from "../../entities/authorization/decodedJWTAuthenticatedUser";

export interface IAuthorizationFailureHttpResponseCreator {
  createResponseForAuthenticatedUser(
    decodedJWTAuthenticatedUser: DecodedJWTAuthenticatedUser,
    res: any
  ): void;

  createResponseForUnAuthenticatedUser(
      res: any
  ): void
}
