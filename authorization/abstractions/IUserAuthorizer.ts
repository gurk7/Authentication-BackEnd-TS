
export interface IUserAuthorizer<TDecodedToken> {
    authorize(decodedToken: TDecodedToken): Promise<boolean>;
}