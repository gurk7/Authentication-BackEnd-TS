import jwt = require("jsonwebtoken");
import { IDecodedTokenRetriever } from "../../abstractions/tokens/IDecodedTokenRetriever";
import { ITokenExtractor } from "../../abstractions/tokens/ITokenExtractor";
import { IObjectToRegularDecodedTokenConverter } from "../../abstractions/tokens/IObjectToRegularDecodedTokenConverter";
import express = require('express');
import { RegularDecodedToken } from "../../entities/regularDecodedToken";

export class JwtRegularDecodedTokenRetriever implements IDecodedTokenRetriever<RegularDecodedToken> {
  private secretOrPublicKey: string;
  private tokenExtractor: ITokenExtractor;
  private converter: IObjectToRegularDecodedTokenConverter;

  constructor(secretOrPublicKey: string, tokenExtractor: ITokenExtractor, converter: IObjectToRegularDecodedTokenConverter) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.tokenExtractor = tokenExtractor;
    this.converter = converter;
  }

  retrieveDecodedToken(req: express.Request) {
    let token = this.tokenExtractor.ExtractToken(req);
    if(!token)
    {
      console.log("Can't extract token from request");
      console.log(req.body);
      return;
    }     
    console.log(`extracted token: ${token}`);

    try
    {
      let decoded = jwt.verify(token, this.secretOrPublicKey);
      try
      {
        return this.converter.convert(decoded);
      }
      catch (e) {
        console.log("can't convert decoded token to RegularDecodedToken");
        console.log(decoded);
        console.log(e);
      }
    }
    catch(e)
    {
      console.log(`can't retrieve decoded token for ${token}`);
      console.log(e);
    }
  }
}
