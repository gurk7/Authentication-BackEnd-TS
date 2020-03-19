import jwt = require("jsonwebtoken");
import { ITokenValidator } from "../abstractions/ITokenValidator";
import { ITokenExtractor } from "../abstractions/ITokenExtractor";

export class JwtTokenValidator implements ITokenValidator {
  private secretOrPublicKey: string;
  private tokenExtractor: ITokenExtractor;

  constructor(secretOrPublicKey: string, tokenExtractor: ITokenExtractor) {
    this.secretOrPublicKey = secretOrPublicKey;
    this.tokenExtractor = tokenExtractor;
  }

  ValidateToken(req: any, res: any, next: any) {
    let token = this.tokenExtractor.ExtractToken(req);

    if (token) {
      jwt.verify(token, this.secretOrPublicKey, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid"
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: "Authentication token is not supplied"
      });
    }
  }
}
