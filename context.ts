import config = require("config");
import { Request, Response } from 'express';
import { TokensConfiguration } from "./config/entities/tokens";
import { ConigurationConsts } from "./consts/configurationConsts";
import jwt = require("jsonwebtoken");

export class Context {
    req: Request;
    res: Response;

    //nullable because token might not be valid
    currentUser?: any;

    constructor(req: Request, res: Response, currentUser?: any) {
        this.req = req;
        this.res = res;
        this.currentUser = currentUser;
    }
}

/*this implementation represents a world wide convention about tokens
 ant therefore it can not be changed. Thus, interface is not needed*/
export function createContext(req: Request, res: Response) {
    const tokensConfig = config.get<TokensConfiguration>(ConigurationConsts.tokens);

    let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;

    let token = req.headers["authorization"];
    if (token?.startsWith("Bearer ")) {
        // Remove Bearer from token value
        token = token.slice(7, token.length);
        try {
            let authenticatedUser = jwt.verify(token, tokenSecretOrPublicKey);
            return new Context(req, res, authenticatedUser)
        }
        catch (e) {
            console.log(`can't retrieve decoded token for ${token}`);
            console.log(e);
        }
    }
    return new Context(req, res);
}