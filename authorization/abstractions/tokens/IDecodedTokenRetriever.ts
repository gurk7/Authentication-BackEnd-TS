import { DecodedJWTAuthenticatedUser } from "../../../common/entities/authorization/decodedJWTAuthenticatedUser";
import express = require('express');

export interface IDecodedTokenRetriever {
  retrieveDecodedToken(req: express.Request): DecodedJWTAuthenticatedUser | undefined;
}
