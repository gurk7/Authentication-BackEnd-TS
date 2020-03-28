

export interface IAuthorizationHandler {
  handleAuthorization(req: any, res: any, next: any): Promise<void>;
}
