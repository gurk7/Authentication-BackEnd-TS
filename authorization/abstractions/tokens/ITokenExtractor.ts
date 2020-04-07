import express = require('express');

export interface ITokenExtractor {
  ExtractToken(req: express.Request): string | undefined;
}
