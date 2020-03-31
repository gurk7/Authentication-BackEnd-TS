
export interface IUserFinder {
    find(username: string): Promise<boolean>;
}