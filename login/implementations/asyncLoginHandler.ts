import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { IAsyncUserAuthenticator } from "../abstractions/IAsyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";

export class AsyncLoginHandler implements ILoginHandler<Promise<void>> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private asyncUserRetriever: IAsyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    userRetriever: IAsyncUserAuthenticator,
    tokenRetriever: ITokenRetriever
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.asyncUserRetriever = userRetriever;
    this.tokenRetriever = tokenRetriever;
  }

  public async handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = await this.asyncUserRetriever.authenticate(
      inputUser
    );
    if (isUserAuthenticated === true) {
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
