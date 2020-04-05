import { DecodedJWTAuthenticatedUser } from "../entities/decodedJWTAuthenticatedUser";
import { FailedAuthorizationResponse } from "../entities/response/failedAuthorizationResponse";

export interface IAuthorizationFailureResponseCreator {
  createResponseForAuthenticatedUser(decodedJWTAuthenticatedUser: DecodedJWTAuthenticatedUser): 
  FailedAuthorizationResponse

  createResponseForUnAuthenticatedUser(): 
  FailedAuthorizationResponse
}
