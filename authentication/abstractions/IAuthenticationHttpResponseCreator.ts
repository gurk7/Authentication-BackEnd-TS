import { User } from "../../entities/authentication/user";

export interface IAuthenticationHttpResponseCreator {
  createResponseForAuthenticatedUser(
    authonticatedUser: User,
    token: string,
    res: any
  ): void;

  createResponseForUnAuthenticatedUser(
    unAuthenticatedUser: User,
    res: any
  ): void;
}
