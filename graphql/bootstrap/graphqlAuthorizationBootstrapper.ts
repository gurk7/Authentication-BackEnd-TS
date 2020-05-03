import { IDecodedTokenParser } from "../../authorization/abstractions/tokens/IDecodedTokenParser";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { ConigurationConsts } from "../../consts/configurationConsts";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { ActiveDirectoryByGroupNameUserFinder } from "../../activeDirectory/userFinder/activeDirectoryByGroupNameUserFinder";
import { LDAPConfiguration } from "../../config/entities/ldap";
import config = require("config");
import { IUserAuthorizer } from "../../authorization/abstractions/IUserAuthorizer";
import { RegularDecodedTokenActiveDirectoryUserAuthorizer } from "../../activeDirectory/authorization/regularDecodedTokenActiveDirectoryUserAuthorizer";
import { RegularDecodedTokenCacheUserAuthorizer } from "../../cache/authorization/regularDecodedTokenCacheUserAuthorizer";
import { RegularDecodedTokenGraphqlAuthorizationHandler } from "../authorization/regularDecodedTokenGraphqlAuthorizationHandler";
import { GraphqlAuthorizationChecker } from "../authorization/authorizationChecker";
import { JwtRegularDecodedTokenParser } from "../../authorization/implementations/tokens/jwtRegularDecodedTokenParser";
const AD = require("ad");

export class GraphqlAuthorizationBootstrapper {
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

        //#region current user parser

        let currentUserParser: IDecodedTokenParser =
            new JwtRegularDecodedTokenParser();

        //#endregion

        //#region active directory

        //#region group member

        let activeDirectoryByGroupNameUserFinder: IUserFinder =
            new ActiveDirectoryByGroupNameUserFinder(activeDirectory, "Allowed Users");

        let regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer: IUserAuthorizer<RegularDecodedToken> =
            new RegularDecodedTokenActiveDirectoryUserAuthorizer(activeDirectoryByGroupNameUserFinder);

        //#endregion

        //#endregion

        //#region cache 

        let allowedCacheUsers: string[] = ["china"];
        let cacheUserAuthorizer: IUserAuthorizer<RegularDecodedToken> = new RegularDecodedTokenCacheUserAuthorizer(allowedCacheUsers);

        //#endregion

        let graphqlCacheAuthorizationHandler = new RegularDecodedTokenGraphqlAuthorizationHandler(currentUserParser,
            cacheUserAuthorizer);

        let graphqlActiveDirectoryAuthoriztionHandler = new RegularDecodedTokenGraphqlAuthorizationHandler(currentUserParser,
            regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer);

        //static members should be initialized by this and not by a Container of specific instances
        new GraphqlAuthorizationChecker(graphqlCacheAuthorizationHandler);
    }
}