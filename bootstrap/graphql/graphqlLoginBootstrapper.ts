import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { ITokenCreator } from "../../authentication/abstractions/ITokenCreator";
import { RegularLoginInputUserJwtTokenCreator } from "../../authentication/implementations/regularLoginInputUserJwtTokenCreator";
import { GraphqlLoginHandler } from '../../authentication/graphql/graphqlLoginHandler';
import { TokensConfiguration } from "../../config/entities/tokens";
import { ConigurationConsts } from "../../consts/configurationConsts";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";
import { RegularLoginInputUserCacheUserAuthenticator } from "../../cache/authentication/regularLoginInputUserCacheUserAuthenticator";
import { RegularLoginInputUserMongoDBUserAuthenticator } from "../../mongo/authentication/regularLoginInputUserMongoDBUserAuthenticator";
import { RegularLoginInputUserActiveDirectoryUserAuthenticator } from "../../activeDirectory/authentication/regularLoginInputUserActiveDirectoryUserAuthenticator";
import { LDAPConfiguration } from "../../config/entities/ldap";

import config = require("config");
import { Container } from 'typedi'
const AD = require("ad");

export class GraphqlLoginBootstrapper {
    public static bootstrap(): void {

        const tokensConfig = config.get<TokensConfiguration>(ConigurationConsts.tokens);
        let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;
        let tokenExpirationTime = tokensConfig.tokenExpirationTime;

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

        let regularLoginInputUserJwtTokenCreator: ITokenCreator<RegularLoginInputUser> = new RegularLoginInputUserJwtTokenCreator(
            tokenSecretOrPublicKey,
            tokenExpirationTime
        );

        //#region Cache

        let allowedUsers: RegularLoginInputUser[] = [new RegularLoginInputUser("china", "china")];
        let regularInputUserCacheUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
            new RegularLoginInputUserCacheUserAuthenticator(
                allowedUsers
            );

        //#endregion

        //#region MongoDB

        let mongoConnectionString = process.env.CONNECTION_STRING as string;

        let regularInputUserMongoDBUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
            new RegularLoginInputUserMongoDBUserAuthenticator(
                mongoConnectionString
            );

        //#endregion

        //#region ActiveDirectory

        let regularInputUserActiveDirectoryUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
            new RegularLoginInputUserActiveDirectoryUserAuthenticator(
                activeDirectory
            );

        //#endregion

        let graphqlLoginHandler = new GraphqlLoginHandler(
            regularInputUserCacheUserAuthenticator,
            regularLoginInputUserJwtTokenCreator);

        Container.set({ id: "LOGIN_HANDLER", factory: () => graphqlLoginHandler });
    }
}