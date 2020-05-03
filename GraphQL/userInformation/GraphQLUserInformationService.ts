import { Service, Inject } from "typedi";
import { IUserInformationRetriever } from "../../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { IDecodedTokenParser } from "../../authorization/abstractions/IDecodedTokenParser";
import { UserInformation } from "../../authentication/entities/userInformation";

@Service()
export class GraphQLUserInformationService {
    @Inject("CURRENT_USER_PARSER")
    private readonly currentUserParser!: IDecodedTokenParser;

    @Inject("USER_INFORMATION_RETRIEVER")
    private readonly userInforamtionRetriever!: IUserInformationRetriever<RegularDecodedToken>

    public async findUserInformation(currentUser: any):
        Promise<UserInformation> {

        let parsedCurrentUser = this.currentUserParser.parse(currentUser);
        return await this.userInforamtionRetriever.retrieve(parsedCurrentUser);
    }
}