import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { ISyncUserAuthenticator } from "../abstractions/ISyncUserAuthenticator";
import { User } from "../../entities/user";

export class SyncLoginHandler implements ILoginHandler<void> {
  private syncUserRetriever: ISyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;

  constructor(
    userRetriever: ISyncUserAuthenticator,
    tokenRetriever: ITokenRetriever
  ) {
    this.syncUserRetriever = userRetriever;
    this.tokenRetriever = tokenRetriever;
  }

  public handleLogin(req: any, res: any) {
    let username: string = req.body.username;
    let password: string = req.body.password;
    let inputUser = new User(username, password);

    let isUserAuthenticated = this.syncUserRetriever.authenticate(inputUser);

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
      console.log(`can't retrieve token for user ${username}`);
      res.json({
        success: false,
        message: "Authenctication Failed! username or password is incorrect"
      });
    }
  }
}
