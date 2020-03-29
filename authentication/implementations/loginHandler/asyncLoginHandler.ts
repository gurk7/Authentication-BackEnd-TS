import { ILoginHandler } from "../../abstractions/loginHandler/ILoginHandler";
import { ITokenCreator } from "../../abstractions/tokens/ITokenCreator";
import { IAsyncUserAuthenticator } from "../../abstractions/userAuthenticator/IAsyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../../abstractions/IUserFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "../../abstractions/IAuthenticationHttpResponseCreator";

export class AsyncLoginHandler implements ILoginHandler<Promise<void>> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private asyncUserAuthenticator: IAsyncUserAuthenticator;
  private tokenCreator: ITokenCreator;
  private authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    asyncUserAuthenticator: IAsyncUserAuthenticator,
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
