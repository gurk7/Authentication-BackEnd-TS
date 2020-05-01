import { RegularLoginInputUser } from "../../authentication/entities/input/regularLoginInputUser";
import { ITokenCreator } from "../../authentication/abstractions/ITokenCreator";
import { RegularLoginInputUserJwtTokenCreator } from "../../authentication/implementations/regularLoginInputUserJwtTokenCreator";
import { GraphqlLoginHandler } from '../../authentication/graphql/graphqlLoginHandler';
import { TokensConfiguration } from "../../config/entities/tokens";
import { ConigurationConsts } from "../../consts/configurationConsts";
import { IAuthenticationResponseCreator } from "../../authentication/abstractions/IAuthenticationResponseCreator";
import { AuthenticationResponseCreator } from "../../authentication/implementations/authenticationResponseCreator";
import { IInputUserAuthenticator } from "../../authentication/abstractions/IInputUserAuthenticator";
import { RegularLoginInputUserCacheUserAuthenticator } from "../../cache/authentication/regularLoginInputUserCacheUserAuthenticator";

import config = require("config");
import { Container } from 'typedi'

export class GraphqlLoginBootstrapper {
    public static bootstrap(): void {

        const tokensConfig = config.get<TokensConfiguration>(ConigurationConsts.tokens);
        let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;
        let tokenExpirationTime = tokensConfig.tokenExpirationTime;

        let regularLoginInputUserJwtTokenCreator: ITokenCreator<RegularLoginInputUser> = new RegularLoginInputUserJwtTokenCreator(
            tokenSecretOrPublicKey,
            tokenExpirationTime
        );

        let authenticationResponseCreator: IAuthenticationResponseCreator =
            new AuthenticationResponseCreator();

        //#region Cache

        let allowedUsers: RegularLoginInputUser[] = [new RegularLoginInputUser("china", "china")];
        let regularInputUserCacheUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
            new RegularLoginInputUserCacheUserAuthenticator(
                allowedUsers
            );

        //#endregion

        let graphqlLoginHandler = new GraphqlLoginHandler(
            regularInputUserCacheUserAuthenticator,
            regularLoginInputUserJwtTokenCreator,
            authenticationResponseCreator);

        Container.set({ id: "LOGIN_HANDLER", factory: () => graphqlLoginHandler });
    }
}