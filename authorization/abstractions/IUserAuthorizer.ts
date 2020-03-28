import  {DecodedJWTAuthenticatedUser} from '../../entities/authorization/decodedJWTAuthenticatedUser';

export interface IUserAuthorizer {
  authorize(jwtUserDecoed: DecodedJWTAuthenticatedUser): Promise<boolean>;
}
