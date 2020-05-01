import { LoginRegularInputUser } from "../../authentication/entities/input/loginRegularInputUser";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";

export class RegularInputUserActiveDirectoryUserAuthenticator implements IInputUserAuthenticator<LoginRegularInputUser> {
    private activeDirectory: any;

    constructor(activeDirectory: any) {
        this.activeDirectory = activeDirectory;
    }

    async authenticate(inputUser: LoginRegularInputUser) {
        try {
            let isUserAuthenticated: boolean = await this.activeDirectory.user(inputUser.username).authenticate(inputUser.password);
            return isUserAuthenticated;
        }
        catch (e) {
            console.log(`Can't authenticate user: ${inputUser.username} in active directory. check your domain connection`)
            console.log(e);
            return false;
        }
    }
};