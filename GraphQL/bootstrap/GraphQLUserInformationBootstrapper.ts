import { IDecodedTokenParser } from "../../authorization/abstractions/IDecodedTokenParser";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { ConigurationConsts } from "../../consts/configurationConsts";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { ActiveDirectoryByGroupNameUserFinder } from "../../activeDirectory/userFinder/activeDirectoryByGroupNameUserFinder";
import { LDAPConfiguration } from "../../config/entities/ldap";
import config from 'config'
import { IUserAuthorizer } from "../../authorization/abstractions/IUserAuthorizer";
import { RegularDecodedTokenActiveDirectoryUserAuthorizer } from "../../activeDirectory/authorization/regularDecodedTokenActiveDirectoryUserAuthorizer";
import { RegularDecodedTokenCacheUserAuthorizer } from "../../cache/authorization/regularDecodedTokenCacheUserAuthorizer";
import { RegularDecodedTokenGraphQLAuthorizationHandler } from "../authorization/regularDecodedTokenGraphQLAuthorizationHandler";
import { GraphQLAuthorizationChecker } from "../authorization/GraphQLAuthorizationChecker";
import { JwtRegularDecodedTokenParser } from "../../authorization/implementations/jwtRegularDecodedTokenParser";
import { IUserInformationRetriever } from "../../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { ActiveDirectoryUserInformationRetriever } from "../../activeDirectory/userInformation/activeDirectoryUserInformationRetriever";
import Container from "typedi";
import { MockUserInformationRetriever } from "../../cache/userInformation/mockUserInformationRetriever";
const AD = require("ad");

export class GraphQLUserInformationBootstrapper {
    public static bootstrap(): void {

        //#region ldap

        const ldapConfig = config.get<LDAPConfiguration>(ConigurationConsts.ldap);

        let url = ldapConfig.url;
        let userFullyQualifiedDomainName = ldapConfig.userFullyQualifiedDomainName;
        let password = ldapConfig.password;

        const activeDirectory = new AD({
            url: url,
            user: userFullyQualifiedDomainName,
            pass: password
        })

        //#endregion

        let currentUserParser: IDecodedTokenParser =
            new JwtRegularDecodedTokenParser();

        //#region Active Directory

        let activeDirectoryUserInformationRetriever: IUserInformationRetriever<RegularDecodedToken> =
            new ActiveDirectoryUserInformationRetriever(activeDirectory);

        //#endregion

        //#region Cache

        let mockCacheUserInformationRetriever: IUserInformationRetriever<RegularDecodedToken> =
            new MockUserInformationRetriever()

        //#endregion

        //Injection for GraphQL userInformationService
        Container.set({ id: "CURRENT_USER_PARSER", factory: () => currentUserParser });

        Container.set({ id: "USER_INFORMATION_RETRIEVER", factory: () => mockCacheUserInformationRetriever });

    }
}