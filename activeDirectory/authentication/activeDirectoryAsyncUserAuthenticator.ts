import { User } from "../../entities/authentication/user";
import { IAsyncUserAuthenticator } from "../../common/abstractions/authentication/IAsyncUserAuthenticator";

export class ActiveDirectoryAsyncUserAuthenticator implements IAsyncUserAuthenticator {
    private activeDirectory: any;

    constructor(activeDirectory: any) {
        this.activeDirectory = activeDirectory;
    }

    async authenticate(inputUser: User) {
        try
        {
            let isUserAuthenticated: boolean = await this.activeDirectory.user(inputUser.username).authenticate(inputUser.password);
            return isUserAuthenticated;
        }
        catch(e)
        {
            console.log(`Can't authenticate user: ${inputUser.username} in active directory. check your domain connection`)
            console.log(e);
            return false;
        }
    }
};