export interface IAuthorizationHandler {
  handleAuthorization(req: any, res: any, next: () => {}): Promise<void>;
}
