
export interface IInputUserAuthenticator<TInputUser> {
  authenticate(inputUser:TInputUser): Promise<boolean>;
}
