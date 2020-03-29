import { ITokenExtractor } from "../../abstractions/tokens/ITokenExtractor";

export class JwtTokenExtractor implements ITokenExtractor {
  ExtractToken(req: any) {
    let token: string =
      req.headers["x-access-token"] || req.headers["authorization"];

    if (token.startsWith("Bearer ")) {
      // Remove Bearer from token value
      token = token.slice(7, token.length);
    }
    return token;
  }
}
