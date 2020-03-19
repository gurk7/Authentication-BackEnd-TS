import { ILoginHandler } from "../abstractions/ILoginHandler";
import { IUserRetriever } from "../abstractions/IUserRetriever";
import jwt = require("jsonwebtoken");

export class LoginHandler implements ILoginHandler {
  userRetriever: IUserRetriever;
  tokenSecretOrPublicKey: string;

  constructor(userRetriever: IUserRetriever, tokenSecretOrPublicKey: string) {
    this.userRetriever = userRetriever;
    this.tokenSecretOrPublicKey = tokenSecretOrPublicKey;
  }

  async HandleLogin(req: any, res: any) {
    let username: string = req.body.username;
    let password: string = req.body.password;

    let user = await this.userRetriever.RetrieveUser(username, password);
    if (user) {
      console.log(`retrieved user ${user.username}`);
      let token = jwt.sign(
        { username: username },
        this.tokenSecretOrPublicKey,
        {
          expiresIn: "24h" // expires in 24shours
        }
      );
      // return the JWT token for the future API calls
      res.json({
        success: true,
        message: "Authentication successful!",
        token: token
      });
    } else {
      res.json({
        success: false,
        message: "Authenctication Failed! username or password is incorrect"
      });
    }
  }
}
