import { User } from "../../entities/user";

export interface ITokenRetriever {
  retrieve(user: User): string;
}
