import config from 'config';
import { Request, Response } from 'express';
import { TokensConfiguration } from "../../config/entities/tokens";
import { ConigurationConsts } from "../../consts/configurationConsts";
import jwt from 'jsonwebtoken';
import { Context } from "./context";

/*this implementation represents a world wide convention about tokens
 ant therefore it can not be changed. Thus, interface is not needed*/
export function createContext(req: Request, res: Response): Context {
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