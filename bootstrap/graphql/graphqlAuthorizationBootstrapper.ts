import { ITokenExtractor } from "../../authorization/abstractions/tokens/ITokenExtractor";
import { JwtTokenExtractor } from "../../authorization/implementations/tokens/jwtTokenExtractor";
import { IObjectToRegularDecodedTokenConverter } from "../../authorization/abstractions/tokens/IObjectToRegularDecodedTokenConverter";
import { JwtObjectToRegularDecodedTokenConverter } from "../../authorization/implementations/tokens/jwtObjectToRegularDecodedTokenConverter";
import { IDecodedTokenRetriever } from "../../authorization/abstractions/tokens/IDecodedTokenRetriever";
import { RegularDecodedToken } from "../../authorization/entities/regularDecodedToken";
import { JwtRegularDecodedTokenRetriever } from "../../authorization/implementations/tokens/jwtRegularDecodedTokenRetriever";
import { TokensConfiguration } from "../../config/entities/tokens";
import { ConigurationConsts } from "../../consts/configurationConsts";
import { IAuthorizationFailureResponseCreator } from "../../authorization/abstractions/IAuthorizationFailureResponseCreator";
import { RegularDecodedTokenAuthorizationFailureResponseCreator } from "../../authorization/implementations/authorizationFailureResponseCreator";
import { IAuthorizationHandler } from "../../authorization/abstractions/IAuthorizationHandler";
import { TokenBasedAuthorizationHandler } from "../../authorization/implementations/tokenBasedAuthorizationHandler";
import { IHttpResponseSender } from "../../common/abstractions/IHttpResponseSender";
import { JsonHttpResponseSender } from "../../common/implementations/JsonHttpResponseSender";
import { IUserFinder } from "../../common/abstractions/IUserFinder";
import { ActiveDirectoryByGroupNameUserFinder } from "../../activeDirectory/userFinder/activeDirectoryByGroupNameUserFinder";
import { LDAPConfiguration } from "../../config/entities/ldap";
import config = require("config");
import { IUserAuthorizer } from "../../authorization/abstractions/IUserAuthorizer";
import { RegularDecodedTokenActiveDirectoryUserAuthorizer } from "../../activeDirectory/authorization/regularDecodedTokenActiveDirectoryUserAuthorizer";

import { Container } from 'typedi'
const AD = require("ad");

export class GraphqlAuthorizationBootstrapper {
    public static bootstrap(): void {

        const ldapConfig = config.get<LDAPConfiguration>(ConigurationConsts.ldap);

        //#region ldap

        let url = ldapConfig.url;
        let userFullyQualifiedDomainName = ldapConfig.userFullyQualifiedDomainName;
        let password = ldapConfig.password;

        const activeDirectory = new AD({
            url: url,
            user: userFullyQualifiedDomainName,
            pass: password
        })

        //#endregion

        const tokensConfig = config.get<TokensConfiguration>(ConigurationConsts.tokens);
        let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;

        let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
        let decodedJWTConverter: IObjectToRegularDecodedTokenConverter =
            new JwtObjectToRegularDecodedTokenConverter();

        let regularDecodedTokenRetriever: IDecodedTokenRetriever<RegularDecodedToken> =
            new JwtRegularDecodedTokenRetriever(tokenSecretOrPublicKey, jwtTokenExtractor, decodedJWTConverter);

        //#region active directory

        //#region group member

        let activeDirectoryByGroupNameUserFinder: IUserFinder =
            new ActiveDirectoryByGroupNameUserFinder(activeDirectory, "Allowed Users");

        let regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer: IUserAuthorizer<RegularDecodedToken> =
            new RegularDecodedTokenActiveDirectoryUserAuthorizer(activeDirectoryByGroupNameUserFinder);

        //#endregion

        //#endregion

        let regularDecodedTokenAuthorizationFailureResponseCreator:
            IAuthorizationFailureResponseCreator<RegularDecodedToken> =
            new RegularDecodedTokenAuthorizationFailureResponseCreator();

        let jsonHttpResponseSender: IHttpResponseSender = new JsonHttpResponseSender();

        let authorizationHandler: IAuthorizationHandler = new TokenBasedAuthorizationHandler(
            regularDecodedTokenRetriever,
            regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer,
            regularDecodedTokenAuthorizationFailureResponseCreator,
            jsonHttpResponseSender);

        Container.set({ id: "AUTHORIZATION_HANDLER", factory: () => authorizationHandler });
    }
}