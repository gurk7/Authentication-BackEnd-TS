import { connect } from "mongodb";
import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";

export class RegularLoginInputUserMongoDBUserAuthenticator implements IInputUserAuthenticator<RegularLoginInputUser> {
  private mongoUrl: string;

  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl;
  }

  async authenticate(inputUser: RegularLoginInputUser) {
    const client = await connect(this.mongoUrl, { useUnifiedTopology: true });
    const db = client.db("authentication");
    const collection = db.collection("users");

    let query = { username: inputUser.username, password: inputUser.password };

    let returnedMongoUser = await collection.findOne<RegularLoginInputUser>(query);
    client.close();

    if (returnedMongoUser) {
      return inputUser.equals(returnedMongoUser);
    }
    return false;
  }
}
