import { IAuthenticationResponseCreator } from "../../abstractions/response/IAuthenticationResponseCreator";
import { SuccessAuthenticationResponse } from "../../entities/response/successAuthenticationResponse";
import { FailedAuthenticationResponse } from "../../entities/response/failedAuthenticationResponse";

export class AuthenticationResponseCreator implements IAuthenticationResponseCreator {
  createResponseForAuthenticatedUser(token: string) {
    return new SuccessAuthenticationResponse(true,
      "Authentication successful!", token);
  }

  createResponseForUnAuthenticatedUser() {
    return new FailedAuthenticationResponse(false,
      "Authenctication Failed! username or password is incorrect");
  }
}
