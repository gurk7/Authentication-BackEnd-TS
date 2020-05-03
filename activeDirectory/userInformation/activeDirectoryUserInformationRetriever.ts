import { IUserInformationRetriever } from "../../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { UserInformation } from "../../authentication/entities/userInformation";

export class ActiveDirectoryUserInformationRetriever implements IUserInformationRetriever<RegularDecodedToken>
{
    private activeDirectory: any;

    constructor(activeDirectory: any) {
        this.activeDirectory = activeDirectory;
    }

    async retrieve(decodedToken: RegularDecodedToken): Promise<UserInformation> {
        let user = await this.activeDirectory.user(decodedToken.username).get();

        let userGroups: string[] = [];

        user.groups.forEach((group: any) => {
            userGroups.push(group.cn);
        });

        let userInformation: UserInformation =
            new UserInformation(
                user.sAMAccountName,
                user.sn,
                user.userPrincipalName,
                userGroups);

        return userInformation;
    }
}