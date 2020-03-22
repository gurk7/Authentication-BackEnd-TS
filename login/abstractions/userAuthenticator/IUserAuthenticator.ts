import { User } from "../../../entities/user";

//this class is Generic because RetrieveUser can return boolean in  a Synchronous code
// or a Promise<boolean> in an Asynchronous code

export interface IUserAuthenticator<T> {
  authenticate(inputUser: User): T;
}
