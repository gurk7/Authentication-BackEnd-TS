
export interface ITokenCreator<TInputUser> {
  create(inputUser: TInputUser): string;
}
