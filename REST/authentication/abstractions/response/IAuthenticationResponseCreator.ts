import { SuccessAuthenticationResponse } from "../../entities/response/successAuthenticationResponse";
import { FailedAuthenticationResponse as FailedAuthenticationResponse } from "../../entities/response/failedAuthenticationResponse";

export interface IAuthenticationResponseCreator {
  createResponseForAuthenticatedUser(token: string): SuccessAuthenticationResponse;
  createResponseForUnAuthenticatedUser(): FailedAuthenticationResponse;
}
