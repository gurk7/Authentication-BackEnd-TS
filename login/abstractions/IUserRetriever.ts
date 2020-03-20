//this class is Generic because RetrieveUser can return User | null directly in  a Synchronous code
// or a Promise<User | null> in an Asynchronous code

export interface IUserRetriever<T> {
  RetrieveUser(username: string, password: string): T;
}
