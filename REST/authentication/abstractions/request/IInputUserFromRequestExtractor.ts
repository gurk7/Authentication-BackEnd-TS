import express = require('express');

export interface IInputUserFromRequestExtractor<TInputUser> {
  extract(req: express.Request): TInputUser;
}
