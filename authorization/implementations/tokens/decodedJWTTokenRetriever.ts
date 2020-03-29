import jwt = require("jsonwebtoken");
import { IDecodedTokenRetriever } from "../../abstractions/tokens/IDecodedTokenRetriever";
import { ITokenExtractor } from "../../abstractions/tokens/ITokenExtractor";
import { IObjectToDecodedJWTConverter } from "../../abstractions/tokens/IObjectToDecodedJWTConverter";

export class DecodedJWTTokenRetriever implements IDecodedTokenRetriever {
  private secretOrPublicKey: string;
  private tokenExtractor: ITokenExtractor;
  private converter: IObjectToDecodedJWTConverter;

  constructor(secretOrPublicKey: string, tokenExtractor: ITokenExtractor, converter: IObjectToDecodedJWTConverter) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.tokenExtractor = tokenExtractor;
    this.converter = converter;
  }

  retrieveDecodedToken(req: any) {
    let token = this.tokenExtractor.ExtractToken(req);
    console.log(`extracted token: ${token}`);

    try {
      let decoded = jwt.verify(token, this.secretOrPublicKey);
      try {
        return this.converter.convert(decoded);
      }
      catch (e) {
        console.log(`can't convert token from object to DecodedJWTUser. token: ${token}`);
        console.log(e);
      }
    }
    catch (e) {
      console.log(`can't retrieve decoded token for ${token}`);
      console.log(e);
    }
  }
}
