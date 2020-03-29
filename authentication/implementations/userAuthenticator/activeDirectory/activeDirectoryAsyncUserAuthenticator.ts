import { User } from "../../../../entities/authentication/user";
import { IAsyncUserAuthenticator } from "../../../abstractions/userAuthenticator/IAsyncUserAuthenticator";

//Authenticate a user by validating that he is in a specific group in active directory
export class ActiveDirectoryAsyncUserAuthenticator implements IAsyncUserAuthenticator {
    private activeDirectory: any;

    constructor(activeDirectory: any) {
        this.activeDirectory = activeDirectory;
    }

    async authenticate(inputUser: User) {
        try
        {
            let isUserAuthenticated: boolean = await this.activeDirectory.user(inputUser.username).authenticate(inputUser.password);
            console.log(`user ${inputUser.username} is authenticated: ${isUserAuthenticated}`);

            return isUserAuthenticated;
        }
        catch(e)
        {
            console.log(`can't authenticate user from active directory. user: ${inputUser.username}`);
            return false;
        }
    }
};