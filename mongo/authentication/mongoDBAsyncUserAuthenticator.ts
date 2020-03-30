import { connect } from "mongodb";
import { User } from "../../entities/authentication/user";
import { IAsyncUserAuthenticator } from "../../common/abstractions/authentication/IAsyncUserAuthenticator";

export class MongoDBAsyncUserAuthenticator implements IAsyncUserAuthenticator {
  private mongoUrl: string;

  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl;
  }

  async authenticate(inputUser: User) {
    const client = await connect(this.mongoUrl, { useUnifiedTopology: true });
    const db = client.db("authentication");
    const collection = db.collection("users");

    let query = { username: inputUser.username, password: inputUser.password };

    let returnedMongoUser = await collection.findOne<User>(query);
    client.close();

    if (returnedMongoUser) {
      return inputUser.equals(returnedMongoUser);
    }
    return false;
  }
}
