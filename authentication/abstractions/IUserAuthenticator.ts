
export interface IUserAuthenticator<TInputUser> {
  authenticate(inputUser:TInputUser): Promise<boolean>;
}
