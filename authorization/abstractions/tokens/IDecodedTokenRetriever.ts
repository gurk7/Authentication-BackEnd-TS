import { DecodedJWTAuthenticatedUser } from "../../entities/decodedJWTAuthenticatedUser";
import express = require('express');

export interface IDecodedTokenRetriever {
  retrieveDecodedToken(req: express.Request): DecodedJWTAuthenticatedUser | undefined;
}
