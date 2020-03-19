import { User } from "../../entities/user";

export interface ITokenRetriever {
  RetrieveToken(user: User): string;
}
