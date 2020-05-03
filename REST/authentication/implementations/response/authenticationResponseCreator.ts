import { IAuthenticationResponseCreator } from "../../abstractions/response/IAuthenticationResponseCreator";
import { FailedAuthenticationResponse } from "../../entities/response/failedAuthenticationResponse";
import { AuthenticationResponse } from "../../../../authentication/entities/response/authenticationResponse";

export class AuthenticationResponseCreator implements IAuthenticationResponseCreator {
  createResponseForAuthenticatedUser(token: string) {
    return new AuthenticationResponse(token);
  }

  createResponseForUnAuthenticatedUser() {
    return new FailedAuthenticationResponse(false,
      "Authenctication Failed! username or password is incorrect");
  }
}
