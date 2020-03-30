import { IUserInformationRetriever } from "../../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { DecodedJWTAuthenticatedUser } from "../../common/entities/authorization/decodedJWTAuthenticatedUser";
import { ActiveDirectoryUserInformation } from "../entities/userInformation/activeDirectoryUserInformation";

export class ActiveDirectoryUserInformationRetriever implements IUserInformationRetriever<ActiveDirectoryUserInformation>
{
    private activeDirectory: any;

    constructor(activeDirectory: any){
        this.activeDirectory = activeDirectory;
    }

    async retrieve(authenticatedUser: DecodedJWTAuthenticatedUser){
        let user = await this.activeDirectory.user(authenticatedUser.username).get();

        let userGroups: string[] = [];

        user.groups.forEach((group: any) => {
            userGroups.push(group.cn);
        });

        let activeDirectoryUserInformation: ActiveDirectoryUserInformation = 
        new ActiveDirectoryUserInformation(user.sAMAccountName, user.sn, user.userPrincipalName, userGroups);

        return activeDirectoryUserInformation;
    }
}