export interface IAuthorizationHandler {
  handleAuthorization(req: any, res: any): Promise<boolean>;
}
