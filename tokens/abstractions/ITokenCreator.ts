import { User } from "../../entities/authentication/user";

export interface ITokenCreator {
  retrieve(user: User): string;
}
