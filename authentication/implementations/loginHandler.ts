import { ILoginHandler } from "../abstractions/ILoginHandler";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";
import { IUserAuthenticator } from "../../common/abstractions/IUserAuthenticator";
import { ITokenCreator } from "../abstractions/ITokenCreator";
import { IAuthenticationHttpResponseCreator } from "../abstractions/IAuthenticationHttpResponseCreator";

export class LoginHandler implements ILoginHandler {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private asyncUserAuthenticator: IUserAuthenticator;
  private tokenCreator: ITokenCreator;
  private authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    asyncUserAuthenticator: IUserAuthenticator,
    tokenCreator: ITokenCreator,
    authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.asyncUserAuthenticator = asyncUserAuthenticator;
    this.tokenCreator = tokenCreator;
    this.authenticationHttpResponseCreator = authenticationHttpResponseCreator;
  }

  public async handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = await this.asyncUserAuthenticator.authenticate(
      inputUser
    );

    if (isUserAuthenticated) {
      let token = this.tokenCreator.create(inputUser);
      this.authenticationHttpResponseCreator.createResponseForAuthenticatedUser(
        inputUser,
        token,
        res
      );
    } else {
      this.authenticationHttpResponseCreator.createResponseForUnAuthenticatedUser(
        inputUser,
        res
      );
    }
  }
}
