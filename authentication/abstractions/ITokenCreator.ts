import { User } from "../entities/user";

export interface ITokenCreator {
  create(user: User): string;
}
