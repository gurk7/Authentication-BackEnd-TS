import { RegularInputUser } from "../../authentication/entities/regularInputUser";
import { IUserAuthenticator } from "../../authentication/abstractions/IUserAuthenticator";

export class RegularInputUserActiveDirectoryUserAuthenticator implements IUserAuthenticator<RegularInputUser> {
    private activeDirectory: any;

    constructor(activeDirectory: any) {
        this.activeDirectory = activeDirectory;
    }

    async authenticate(inputUser: RegularInputUser) {
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