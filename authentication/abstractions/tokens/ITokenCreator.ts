import { User } from "../../../entities/authentication/user";

export interface ITokenCreator {
  create(user: User): string;
}
