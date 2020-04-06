import { IObjectToRegularDecodedTokenConverter } from '../../abstractions/tokens/IObjectToRegularDecodedTokenConverter';
import { RegularDecodedToken } from '../../entities/regularDecodedToken';

export class ObjectToRegularDecodedTokenConverter implements IObjectToRegularDecodedTokenConverter {

    convert(decodedToken: any): RegularDecodedToken {
        console.log(decodedToken);
        return new RegularDecodedToken(decodedToken.username, decodedToken.iat, decodedToken.exp)
    }

}