import { DecodedJWTAuthenticatedUser } from '../../entities/decodedJWTAuthenticatedUser';

export interface IObjectToDecodedJWTConverter {
  convert(jwtUserDecoded: any): DecodedJWTAuthenticatedUser;
}
