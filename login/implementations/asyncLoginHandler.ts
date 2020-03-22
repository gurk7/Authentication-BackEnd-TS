import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { IAsyncUserAuthenticator } from "../abstractions/IAsyncUserAuthenticator";
import { User } from "../../entities/user";

export class AsyncLoginHandler implements ILoginHandler<Promise<void>> {
  private asyncUserRetriever: IAsyncUserAuthenticator;
  private tokenRetriever: ITokenRetriever;

  constructor(
    userRetriever: IAsyncUserAuthenticator,
    tokenRetriever: ITokenRetriever
  ) {
    this.asyncUserRetriever = userRetriever;
    this.tokenRetriever = tokenRetriever;
  }

  public async handleLogin(req: any, res: any) {
    let username: string = req.body.username;
    let password: string = req.body.password;
    let inputUser = new User(username, password);

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
      console.log(`can't retrieve token for user ${username}`);
      res.json({
        success: false,
        message: "Authenctication Failed! username or password is incorrect"
      });
    }
  }
}
