import { RegularDecodedToken } from '../../entities/regularDecodedToken';

export interface IObjectToRegularDecodedTokenConverter {
  convert(jwtUserDecoded: any): RegularDecodedToken;
}
