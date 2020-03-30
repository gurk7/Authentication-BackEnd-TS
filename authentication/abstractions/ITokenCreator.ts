import { User } from "../../common/entities/authentication/user";

export interface ITokenCreator {
  create(user: User): string;
}
