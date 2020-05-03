import jwt from 'jsonwebtoken';
import { ITokenExtractor } from "../../abstractions/request/ITokenExtractor";
import { IDecodedTokenParser } from "../../../../authorization/abstractions/IDecodedTokenParser";
import { Request } from 'express'
import { RegularDecodedToken } from "../../../../authorization/entities/regularDecodedToken";
import { IDecodedTokenRetriever } from '../../abstractions/request/IDecodedTokenRetriever';

export class JwtRegularDecodedTokenRetriever implements IDecodedTokenRetriever<RegularDecodedToken> {
  private secretOrPublicKey: string;
  private tokenExtractor: ITokenExtractor;
  private parser: IDecodedTokenParser;

  constructor(secretOrPublicKey: string, tokenExtractor: ITokenExtractor, parser: IDecodedTokenParser) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.tokenExtractor = tokenExtractor;
    this.parser = parser;
  }

  retrieveDecodedToken(req: Request) {
    let token = this.tokenExtractor.ExtractToken(req);
    let decoded = jwt.verify(token, this.secretOrPublicKey);
    return this.parser.parse(decoded);
  }
}
