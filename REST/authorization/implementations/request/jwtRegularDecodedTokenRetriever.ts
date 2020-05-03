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
    if (!token) {
      console.log("Can't extract token from request");
      console.log(req.body);
      return;
    }
    console.log(`extracted token: ${token}`);

    try {
      let decoded = jwt.verify(token, this.secretOrPublicKey);
      try {
        return this.parser.parse(decoded);
      }
      catch (e) {
        console.log("can't convert decoded token to RegularDecodedToken");
        console.log(decoded);
        console.log(e);
      }
    }
    catch (e) {
      console.log(`can't retrieve decoded token for ${token}`);
      console.log(e);
    }
  }
}
