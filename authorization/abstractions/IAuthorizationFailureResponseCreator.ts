import { FailedAuthorizationResponse } from "../entities/response/failedAuthorizationResponse";

export interface IAuthorizationFailureResponseCreator<TDecodedToken> {
  createResponseForAuthenticatedUser(decodedToken: TDecodedToken): 
  FailedAuthorizationResponse

  createResponseForUnAuthenticatedUser(): 
  FailedAuthorizationResponse
}
