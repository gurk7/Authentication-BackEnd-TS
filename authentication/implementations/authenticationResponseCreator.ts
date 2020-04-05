import { IAuthenticationResponseCreator } from "../abstractions/IAuthenticationResponseCreator";
import { SuccessAuthenticationHttpResponse } from "../entities/httpResponse/successAuthenticationHttpResponse";
import { FailedAuthenticationHttpResponse } from "../entities/httpResponse/failedAuthenticationHttpResponse";

export class AuthenticationResponseCreator implements IAuthenticationResponseCreator {   
  createResponseForAuthenticatedUser(token: string) {
    return new SuccessAuthenticationHttpResponse(true, 
      "Authentication successful!", token);
  }

  createResponseForUnAuthenticatedUser() {
    return new FailedAuthenticationHttpResponse(false, 
      "Authenctication Failed! username or password is incorrect");
  }
}
