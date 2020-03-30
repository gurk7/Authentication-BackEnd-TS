import { DecodedJWTAuthenticatedUser } from '../../../common/entities/authorization/decodedJWTAuthenticatedUser';

export interface IObjectToDecodedJWTConverter {
  convert(jwtUserDecoded: any): DecodedJWTAuthenticatedUser;
}
