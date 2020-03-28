import { DecodedJWTAuthenticatedUser } from '../../entities/authorization/decodedJWTAuthenticatedUser';

export interface IObjectToDecodedJWTConverter {
  convert(jwtUserDecoded: any): DecodedJWTAuthenticatedUser;
}
