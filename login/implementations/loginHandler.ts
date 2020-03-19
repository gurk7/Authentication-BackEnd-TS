import { ILoginHandler } from "../abstractions/ILoginHandler";
import { IUserRetriever } from "../abstractions/IUserRetriever";
import { ITokenRetriever } from "../../tokens/abstractions/ITokenRetriever";

export class LoginHandler implements ILoginHandler {
  private userRetriever: IUserRetriever;
  private tokenRetriever: ITokenRetriever;

  constructor(userRetriever: IUserRetriever, tokenRetriever: ITokenRetriever) {
    this.userRetriever = userRetriever;
    this.tokenRetriever = tokenRetriever;
  }

  public async HandleLogin(req: any, res: any) {
    let username: string = req.body.username;
    let password: string = req.body.password;

    let user = await this.userRetriever.RetrieveUser(username, password);
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
