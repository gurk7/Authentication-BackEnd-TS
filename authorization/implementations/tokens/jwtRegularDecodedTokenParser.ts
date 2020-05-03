import { IDecodedTokenParser } from '../../abstractions/tokens/IDecodedTokenParser';
import { RegularDecodedToken } from '../../entities/regularDecodedToken';

export class JwtRegularDecodedTokenParser implements IDecodedTokenParser {

    parse(decodedToken: any): RegularDecodedToken {
        console.log(decodedToken);
        return new RegularDecodedToken(decodedToken.username, decodedToken.iat, decodedToken.exp)
    }

}