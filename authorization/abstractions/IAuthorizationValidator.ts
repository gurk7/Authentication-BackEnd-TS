//Login is generic because HandleLogin might be a void function or it might return Promise<void>

export interface IAuthorizationValidator {
    validateAuthorization(req: any, res: any): Promise<boolean>;
  }
  