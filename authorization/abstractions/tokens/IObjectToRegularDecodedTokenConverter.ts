import { RegularDecodedToken } from '../../entities/regularDecodedToken';

export interface IObjectToRegularDecodedTokenConverter {
  convert(decodedToken: any): RegularDecodedToken;
}
