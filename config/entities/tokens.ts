export class TokensConfiguration {
  tokenSecretOrPublicKey: string;
  tokenExpirationTime: string;

  constructor(tokenSecretOrPublicKey: string, tokenExpirationTime: string) {
    this.tokenSecretOrPublicKey = tokenSecretOrPublicKey;
    this.tokenExpirationTime = tokenExpirationTime;
  }
}
