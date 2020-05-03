import { Request } from 'express';

export interface IDecodedTokenRetriever<TDecodedToken> {
  retrieveDecodedToken(req: Request): TDecodedToken | undefined;
}
