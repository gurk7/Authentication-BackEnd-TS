import { User } from "../entities/authentication/user";

//this class is Generic because RetrieveUser can return boolean in  a Synchronous code
// or a Promise<boolean> in an Asynchronous code

export interface IUserAuthenticator {
  authenticate(inputUser: User): Promise<boolean>;
}
