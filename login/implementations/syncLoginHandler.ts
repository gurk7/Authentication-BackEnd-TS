import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { ISyncUserAuthenticator } from "../abstractions/ISyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";

export class SyncLoginHandler implements ILoginHandler<void> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private syncUserAuthenticator: ISyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    syncUserAuthenticator: ISyncUserAuthenticator,
    tokenRetriever: ITokenRetriever
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.syncUserAuthenticator = syncUserAuthenticator;
    this.tokenRetriever = tokenRetriever;
  }

  public handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = this.syncUserAuthenticator.authenticate(
      inputUser
    );

    if (isUserAuthenticated) {
      console.log(`retrieved user ${inputUser.username}`);

      let token = this.tokenRetriever.RetrieveToken(inputUser);
      console.log(
        `retrieved for user ${inputUser.username} the token: ${token} `
      );

      res.json({
        success: true,
        message: "Authentication successful!",
        token: token
      });
    } else {
      console.log(`can't retrieve token for user ${inputUser.username}`);
      res.json({
        success: false,
        message: "Authenctication Failed! username or password is incorrect"
      });
    }
  }
}
