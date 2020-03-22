import { User } from "../../entities/user";
import { IUserFromRequestExtractor } from "../abstractions/IUserFromRequestExtractor";

export class UserFromRequestExtractor implements IUserFromRequestExtractor {
  extract(req: any): User {
    let username: string = req.body.username;
    let password: string = req.body.password;

    return new User(username, password);
  }
}