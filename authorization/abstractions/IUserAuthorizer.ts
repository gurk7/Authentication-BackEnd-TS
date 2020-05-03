
export interface IUserAuthorizer<TCurrentUser> {
    authorize(currentUser: TCurrentUser): Promise<boolean>;
}