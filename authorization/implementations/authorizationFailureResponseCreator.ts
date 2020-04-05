import { IAuthorizationFailureResponseCreator } from "../abstractions/IAuthorizationFailureResponseCreator";
import { DecodedJWTAuthenticatedUser } from "../entities/decodedJWTAuthenticatedUser";
import { FailedAuthorizationResponse } from "../entities/response/failedAuthorizationResponse";

export class AuthorizationFailureResponseCreator
  implements  IAuthorizationFailureResponseCreator
  {
    createResponseForAuthenticatedUser(
        decodedJWTAuthenticatedUser: DecodedJWTAuthenticatedUser) {
            return new FailedAuthorizationResponse(false, 
                `User: ${decodedJWTAuthenticatedUser.username} is not authorized`);
        }

    createResponseForUnAuthenticatedUser(){
        return new FailedAuthorizationResponse(false, 
            "Can not decode the specified token. check you token's signature (when using JWT)")
        }
  }
