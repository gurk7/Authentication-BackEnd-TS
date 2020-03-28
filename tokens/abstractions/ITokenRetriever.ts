import { User } from "../../entities/authentication/user";

export interface ITokenRetriever {
  retrieve(user: User): string;
}
