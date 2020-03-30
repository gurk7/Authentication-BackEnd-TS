import { IAsyncUserAuthenticator } from "../../common/abstractions/authentication/IAsyncUserAuthenticator";
import { User } from "../../common/entities/authentication/user";

export class ActiveDirectoryUserAuthenticator implements IAsyncUserAuthenticator {
    private activeDirectory: any;

    constructor(activeDirectory: any) {
        this.activeDirectory = activeDirectory;
    }

    async authenticate(inputUser: User) {
        try
        {
            let isUserAuthenticated: boolean = await this.activeDirectory.user(inputUser.username).authenticate(inputUser.password);
            console.log(`User ${inputUser.username} is authenticated: ${isUserAuthenticated}`);

            return isUserAuthenticated;
        }
        catch(e)
        {
            console.log(`Can't authenticate user in active directory. Username or password is incorrect. `+
            `user: ${inputUser.username}`);
            return false;
        }
    }
};