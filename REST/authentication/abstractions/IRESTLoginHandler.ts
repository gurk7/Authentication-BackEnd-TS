import express = require('express');

export interface IRESTLoginHandler {
  handleLogin(req: express.Request, res: express.Response): Promise<void>;
}
