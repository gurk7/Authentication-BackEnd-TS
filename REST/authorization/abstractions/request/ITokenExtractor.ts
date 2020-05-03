import { Request } from 'express';

export interface ITokenExtractor {
  ExtractToken(req: Request): string | undefined;
}
