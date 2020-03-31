import express = require('express');

export interface IAuthorizationHandler {
  handleAuthorization(req: express.Request, res: express.Response): Promise<boolean>;
}
