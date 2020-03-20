//this class is Generic because retrieving user can return User | null directly or a Promise<User | null>

export interface IUserRetriever<T> {
  RetrieveUser(username: string, password: string): T;
}
