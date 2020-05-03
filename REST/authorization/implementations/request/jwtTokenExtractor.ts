import { Request } from 'express';
import { ITokenExtractor } from '../../abstractions/request/ITokenExtractor';

export class JwtTokenExtractor implements ITokenExtractor {
  ExtractToken(req: Request) {
    let token = req.headers["authorization"];
    if (!token) return;

    if (token.startsWith("Bearer ")) {
      // Remove Bearer from token value
      token = token.slice(7, token.length);
    }
    return token;
  }
}
