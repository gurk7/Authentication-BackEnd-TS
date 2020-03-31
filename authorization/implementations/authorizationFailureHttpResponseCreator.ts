import { IAuthorizationFailureHttpResponseCreator } from "../abstractions/IAuthorizationFailureHttpResponseCreator";
import { DecodedJWTAuthenticatedUser } from "../entities/decodedJWTAuthenticatedUser";

export class AuthorizationFailureHttpResponseCreator
  implements  IAuthorizationFailureHttpResponseCreator
  {
    createResponseForAuthenticatedUser(
        decodedJWTAuthenticatedUser: DecodedJWTAuthenticatedUser,
        res: any) {
            res.json({
                success: false,
                message: `User: ${decodedJWTAuthenticatedUser.username} is not authorized`
            });
        }

    createResponseForUnAuthenticatedUser(
        res: any){
            res.json({
                success: false,
                message: "Can not decode the specified token. check you token's signature (when using JWT)"
            });
        }
  }
