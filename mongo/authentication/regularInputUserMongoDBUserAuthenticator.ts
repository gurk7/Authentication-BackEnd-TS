import { connect } from "mongodb";
import { LoginRegularInputUser } from "../../authentication/entities/input/loginRegularInputUser";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";

export class RegularInputUserMongoDBUserAuthenticator implements IInputUserAuthenticator<LoginRegularInputUser> {
  private mongoUrl: string;

  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl;
  }

  async authenticate(inputUser: LoginRegularInputUser) {
    const client = await connect(this.mongoUrl, { useUnifiedTopology: true });
    const db = client.db("authentication");
    const collection = db.collection("users");

    let query = { username: inputUser.username, password: inputUser.password };

    let returnedMongoUser = await collection.findOne<LoginRegularInputUser>(query);
    client.close();

    if (returnedMongoUser) {
      return inputUser.equals(returnedMongoUser);
    }
    return false;
  }
}
