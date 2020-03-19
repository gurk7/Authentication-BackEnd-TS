export interface ILoginHandler {
  HandleLogin(req: any, res: any): Promise<void>;
}
