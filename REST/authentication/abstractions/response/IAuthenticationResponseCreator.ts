import { FailedAuthenticationResponse as FailedAuthenticationResponse } from "../../entities/response/failedAuthenticationResponse";
import { AuthenticationResponse } from "../../../../authentication/entities/response/authenticationResponse";

export interface IAuthenticationResponseCreator {
  createResponseForAuthenticatedUser(token: string): AuthenticationResponse;
  createResponseForUnAuthenticatedUser(): FailedAuthenticationResponse;
}
