import { IUserAuthorizer } from "../../authorization/abstractions/IUserAuthorizer";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";

export class RegularDecodedTokenCacheUserAuthorizer implements IUserAuthorizer<RegularDecodedToken> {
    private allowedUsers: string[];

    constructor(allowedUsers: string[]) {
        this.allowedUsers = allowedUsers;
    }

    async authorize(decodedToken: RegularDecodedToken): Promise<boolean> {
        for (let allowedUser of this.allowedUsers) {
            if (allowedUser == decodedToken.username) {
                return true;
            }
        }
        return false;
    }
}
