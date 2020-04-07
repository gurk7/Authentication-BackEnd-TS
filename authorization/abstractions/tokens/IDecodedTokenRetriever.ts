import express = require('express');

export interface IDecodedTokenRetriever<TDecodedToken> {
  retrieveDecodedToken(req: express.Request): TDecodedToken | undefined;
}
