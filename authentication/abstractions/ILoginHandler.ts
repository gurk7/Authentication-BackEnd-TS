//Login is generic because HandleLogin might be a void function or it might return Promise<void>

export interface ILoginHandler {
  handleLogin(req: any, res: any): Promise<void>;
}
