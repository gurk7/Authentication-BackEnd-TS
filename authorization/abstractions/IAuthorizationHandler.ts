export interface IAuthorizationHandler {
  handleAuthorization(req: any, res: any, next: () => void): Promise<void>;
}
