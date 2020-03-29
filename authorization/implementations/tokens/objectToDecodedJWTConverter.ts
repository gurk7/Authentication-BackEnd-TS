import { IObjectToDecodedJWTConverter } from '../../abstractions/tokens/IObjectToDecodedJWTConverter';
import { DecodedJWTAuthenticatedUser } from '../../../entities/authorization/decodedJWTAuthenticatedUser';

export class ObjectToDecodedJWTConverter implements IObjectToDecodedJWTConverter {

    convert(jwtUserDecoded: any): DecodedJWTAuthenticatedUser {
        console.log(jwtUserDecoded);
        return new DecodedJWTAuthenticatedUser(jwtUserDecoded.username, jwtUserDecoded.iat, jwtUserDecoded.exp)
    }

}