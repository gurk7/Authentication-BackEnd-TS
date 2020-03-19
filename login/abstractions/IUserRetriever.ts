import { User } from "../../entities/user";

export interface IUserRetriever {
  RetrieveUser(username: string, password: string): Promise<User | null>;
}
