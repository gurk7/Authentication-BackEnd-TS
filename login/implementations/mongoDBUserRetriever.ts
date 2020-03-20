import { connect } from "mongodb";
import { User } from "../../entities/user";
import { IDBUserRetriever } from "../abstractions/IDBUserRetriever";

export class MongoDBUserRetriever implements IDBUserRetriever {
  mongoUrl: string;

  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl;
  }

  async RetrieveUser(username: string, password: string) {
    const client = await connect(this.mongoUrl, { useUnifiedTopology: true });
    const db = client.db("authentication");
    const collection = db.collection("users");

    var query = { username: username, password: password };

    return await collection.findOne<User>(query);
  }
}
