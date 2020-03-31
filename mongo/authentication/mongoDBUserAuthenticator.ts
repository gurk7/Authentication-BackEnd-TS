import { connect } from "mongodb";
import { User } from "../../authentication/entities/user";
import { IUserAuthenticator } from "../../authentication/abstractions/IUserAuthenticator";

export class MongoDBUserAuthenticator implements IUserAuthenticator {
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
