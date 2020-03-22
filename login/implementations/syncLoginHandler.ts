import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { ISyncUserAuthenticator } from "../abstractions/ISyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "../abstractions/IAuthenticationHttpResponseCreator";

export class SyncLoginHandler implements ILoginHandler<void> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private syncUserAuthenticator: ISyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;
  private authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    syncUserAuthenticator: ISyncUserAuthenticator,
    tokenRetriever: ITokenRetriever,
    authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.syncUserAuthenticator = syncUserAuthenticator;
    this.tokenRetriever = tokenRetriever;
    this.authenticationHttpResponseCreator = authenticationHttpResponseCreator;
  }

  public handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = this.syncUserAuthenticator.authenticate(
      inputUser
    );

    if (isUserAuthenticated) {
      let token = this.tokenRetriever.retrieve(inputUser);
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
