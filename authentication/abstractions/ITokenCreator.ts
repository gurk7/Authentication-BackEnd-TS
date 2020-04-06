
export interface ITokenCreator<T> {
  create(user: T): string;
}
