import  {DecodedJWTAuthenticatedUser} from '../../entities/authorization/decodedJWTAuthenticatedUser';

export interface IObjectToDecodedJWTConverter {
  convert(jwtUserDecoed: any): DecodedJWTAuthenticatedUser;
}
