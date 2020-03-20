import { ILoginHandler } from "../abstractions/ILoginHandler";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";
import { IAsyncUserRetriever } from "../abstractions/IAsyncUserRetriever";

export class AsyncLoginHandler implements ILoginHandler<Promise<void>> {
  private asyncUserRetriever: IAsyncUserRetriever;
  private tokenRetriever: ITokenRetriever;

  constructor(
    userRetriever: IAsyncUserRetriever,
    tokenRetriever: ITokenRetriever
  ) {
    this.asyncUserRetriever = userRetriever;
    this.tokenRetriever = tokenRetriever;
  }

  public async HandleLogin(req: any, res: any) {
    let username: string = req.body.username;
    let password: string = req.body.password;

    let user = await this.asyncUserRetriever.RetrieveUser(username, password);
    if (user) {
      console.log(`retrieved user ${user.username}`);

      let token = this.tokenRetriever.RetrieveToken(user);
      console.log(`retrieved for user ${user.username} the token: ${token} `);

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
