import { User } from "../../entities/user";

export interface IAuthenticationHttpResponseCreator {
  createResponseforAuthenticatedUser(
    authonticatedUser: User,
    token: string,
    res: any
  ): void;

  createResponseForUnAuthenticatedUser(
    unauthenticatedUser: User,
    res: any
  ): void;
}
