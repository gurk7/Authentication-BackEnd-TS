import { ITokenExtractor } from "../../abstractions/tokens/ITokenExtractor";
import express = require('express');

export class JwtTokenExtractor implements ITokenExtractor {
  ExtractToken(req: express.Request) {   
    let token = req.headers["authorization"];
    if(!token) return;

    if (token.startsWith("Bearer ")) {
      // Remove Bearer from token value
      token = token.slice(7, token.length);
    }
    return token;
  }
}
