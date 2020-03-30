import { ILoginHandler } from "../../abstractions/ILoginHandler";
import { ITokenCreator } from "../../abstractions/ITokenCreator";
import { ISyncUserAuthenticator } from "../../../common/abstractions/authentication/ISyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../../abstractions/IUserFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "../../abstractions/IAuthenticationHttpResponseCreator";

export class SyncLoginHandler implements ILoginHandler<void> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private syncUserAuthenticator: ISyncUserAuthenticator;
  private tokenCreator: ITokenCreator;
  private authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    syncUserAuthenticator: ISyncUserAuthenticator,
    tokenCreator: ITokenCreator,
    authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.syncUserAuthenticator = syncUserAuthenticator;
    this.tokenCreator = tokenCreator;
    this.authenticationHttpResponseCreator = authenticationHttpResponseCreator;
  }

  public handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = this.syncUserAuthenticator.authenticate(
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
