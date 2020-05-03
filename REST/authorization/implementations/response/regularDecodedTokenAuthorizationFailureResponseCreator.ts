import { IAuthorizationFailureResponseCreator } from "../../abstractions/response/IAuthorizationFailureResponseCreator";
import { RegularDecodedToken } from "../../../../authorization/entities/regularDecodedToken";
import { FailedAuthorizationResponse } from "../../entities/response/failedAuthorizationResponse";

export class RegularDecodedTokenAuthorizationFailureResponseCreator
    implements IAuthorizationFailureResponseCreator<RegularDecodedToken>
{
    createResponseForAuthenticatedUser(
        regularDecodedToken: RegularDecodedToken) {
        return new FailedAuthorizationResponse(false,
            `User: ${regularDecodedToken.username} is not authorized`);
    }

    createResponseForUnAuthenticatedUser() {
        return new FailedAuthorizationResponse(false,
            "Can not decode the specified token. check you token's signature (when using JWT)")
    }
}
