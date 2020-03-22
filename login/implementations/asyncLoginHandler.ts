import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { IAsyncUserAuthenticator } from "../abstractions/IAsyncUserAuthenticator";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";

export class AsyncLoginHandler implements ILoginHandler<Promise<void>> {
  private userFromRequestExtractor: IUserFromRequestExtractor;
  private asyncUserAuthenticator: IAsyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;

  constructor(
    userFromRequestExtractor: IUserFromRequestExtractor,
    asyncUserAuthenticator: IAsyncUserAuthenticator,
    tokenRetriever: ITokenRetriever
  ) {
    this.userFromRequestExtractor = userFromRequestExtractor;
    this.asyncUserAuthenticator = asyncUserAuthenticator;
    this.tokenRetriever = tokenRetriever;
  }

  public async handleLogin(req: any, res: any) {
    let inputUser = this.userFromRequestExtractor.extract(req);

    let isUserAuthenticated = await this.asyncUserAuthenticator.authenticate(
      inputUser
    );
    if (isUserAuthenticated === true) {
      console.log(`retrieved user ${inputUser.username}`);

      let token = this.tokenRetriever.retrieve(inputUser);
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
