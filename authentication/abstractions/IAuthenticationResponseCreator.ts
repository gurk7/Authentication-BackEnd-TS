import { SuccessAuthenticationHttpResponse } from "../entities/httpResponse/successAuthenticationHttpResponse";
import { FailedAuthenticationHttpResponse } from "../entities/httpResponse/failedAuthenticationHttpResponse";

export interface IAuthenticationResponseCreator {
  createResponseForAuthenticatedUser(token: string): SuccessAuthenticationHttpResponse;
  createResponseForUnAuthenticatedUser(): FailedAuthenticationHttpResponse;
}
