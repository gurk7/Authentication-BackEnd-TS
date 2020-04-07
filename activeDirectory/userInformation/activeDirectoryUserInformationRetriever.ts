import { IUserInformationRetriever } from "../../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { ActiveDirectoryUserInformation } from "../entities/userInformation/activeDirectoryUserInformation";

export class ActiveDirectoryUserInformationRetriever implements IUserInformationRetriever<ActiveDirectoryUserInformation>
{
    private activeDirectory: any;

    constructor(activeDirectory: any){
        this.activeDirectory = activeDirectory;
    }

    async retrieve(decodedToken: RegularDecodedToken){
        let user = await this.activeDirectory.user(decodedToken.username).get();

        let userGroups: string[] = [];

        user.groups.forEach((group: any) => {
            userGroups.push(group.cn);
        });

        let activeDirectoryUserInformation: ActiveDirectoryUserInformation = 
        new ActiveDirectoryUserInformation(user.sAMAccountName, user.sn, user.userPrincipalName, userGroups);

        return activeDirectoryUserInformation;
    }
}