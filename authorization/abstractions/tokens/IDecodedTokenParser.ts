import { RegularDecodedToken } from '../../entities/regularDecodedToken';

export interface IDecodedTokenParser {
  parse(decodedToken: any): RegularDecodedToken;
}
