export interface ITokenValidator {
  ValidateToken(req: any, res: any, next: () => void): any;
}
