import { IUserInformationRetriever } from "../../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { UserInformation } from "../../authentication/entities/userInformation";

export class MockUserInformationRetriever implements IUserInformationRetriever<RegularDecodedToken>{
    retrieve(crrentUser: RegularDecodedToken): Promise<UserInformation> {
        return Promise.resolve(
            new UserInformation(crrentUser.username,
                "yaya",
                "YaYa@mail.com",
                ["kings", "metorafim"]
            )
        );
    }
}