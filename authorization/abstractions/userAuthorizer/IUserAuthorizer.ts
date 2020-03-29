import { DecodedJWTAuthenticatedUser } from '../../../entities/authorization/decodedJWTAuthenticatedUser';

//checks if the user is authorized for a specific function
export interface IUserAuthorizer {
  authorize(jwtUserDecoed: DecodedJWTAuthenticatedUser): Promise<boolean>;
}
