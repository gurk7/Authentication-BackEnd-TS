import {IObjectToDecodedJWTConverter} from '../abstractions/IObjectToDecodedJWTConverter';
import { DecodedJWTAuthenticatedUser } from '../../entities/authorization/decodedJWTAuthenticatedUser';

export class ObjectToDecodedJWTConverter implements IObjectToDecodedJWTConverter{

    convert(jwtUserDecoed: any): DecodedJWTAuthenticatedUser{
        console.log(jwtUserDecoed);
        return new DecodedJWTAuthenticatedUser(jwtUserDecoed.username, jwtUserDecoed.iat, jwtUserDecoed.exp)
    }

}