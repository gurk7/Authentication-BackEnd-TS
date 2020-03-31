import { DecodedJWTAuthenticatedUser } from "../entities/decodedJWTAuthenticatedUser";

export interface IAuthorizationFailureHttpResponseCreator {
  createResponseForAuthenticatedUser(
    decodedJWTAuthenticatedUser: DecodedJWTAuthenticatedUser,
    res: any
  ): void;

  createResponseForUnAuthenticatedUser(
      res: any
  ): void
}
