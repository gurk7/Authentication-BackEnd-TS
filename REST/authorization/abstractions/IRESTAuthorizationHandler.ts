import { Request, Response } from 'express';

export interface IRESTAuthorizationHandler {
  handleAuthorization(req: Request, res: Response): Promise<boolean>;
}
