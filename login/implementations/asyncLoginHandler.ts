import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { IAsyncUserAuthenticator } from "../abstractions/IAsyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "../abstractions/IAuthenticationHttpResponseCreator";

export class AsyncLoginHandler implements ILoginHandler<Promise<void>> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private asyncUserAuthenticator: IAsyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;
  private authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    asyncUserAuthenticator: IAsyncUserAuthenticator,
    tokenRetriever: ITokenRetriever,
    authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.asyncUserAuthenticator = asyncUserAuthenticator;
    this.tokenRetriever = tokenRetriever;
    this.authenticationHttpResponseCreator = authenticationHttpResponseCreator;
  }

  public async handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = await this.asyncUserAuthenticator.authenticate(
      inputUser
    );

    if (isUserAuthenticated) {
      let token = this.tokenRetriever.retrieve(inputUser);
      this.authenticationHttpResponseCreator.createResponseforAuthenticatedUser(
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
