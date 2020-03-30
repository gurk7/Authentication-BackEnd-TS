import { IAuthenticationHttpResponseCreator } from "../abstractions/IAuthenticationHttpResponseCreator";
import { User } from "../../common/entities/authentication/user";

export class AuthenticationHttpResponseCreator
  implements IAuthenticationHttpResponseCreator {
  createResponseForAuthenticatedUser(
    authonticatedUser: User,
    token: string,
    res: any
  ) {
    console.log(
      `retrieved for authenticated user: ${authonticatedUser.username} the token: ${token} `
    );

    res.json({
      success: true,
      message: "Authentication successful!",
      token: token
    });
  }

  createResponseForUnAuthenticatedUser(unauthenticatedUser: User, res: any) {
    console.log(
      `can't retrieve token for unauthenticated user: ${unauthenticatedUser.username}`
    );
    res.json({
      success: false,
      message: "Authenctication Failed! username or password is incorrect"
    });
  }
}
