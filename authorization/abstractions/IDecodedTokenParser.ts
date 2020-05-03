import { RegularDecodedToken } from '../entities/regularDecodedToken';

export interface IDecodedTokenParser {
  //parsing object to Specific RegularDecodedToken
  parse(decodedToken: any): RegularDecodedToken;
}
