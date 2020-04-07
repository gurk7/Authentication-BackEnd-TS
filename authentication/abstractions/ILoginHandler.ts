import express = require('express');

export interface ILoginHandler {
  handleLogin(req: express.Request, res: express.Response): Promise<void>;
}
