//#region outer imports
import "reflect-metadata"
import express = require("express");
import cors = require("cors");
import https = require("https");
import fs = require("fs");
import bodyParser = require("body-parser");
import config = require("config");

//#region js packages

const AD = require("ad");

//#endregion

//#endregion

//#region inner imports

import { TokenBasedLoginHandler } from "./authentication/implementations/tokenBasedloginHandler";
import { RegularLoginInputUserMongoDBUserAuthenticator } from "./mongo/authentication/regularLoginInputUserMongoDBUserAuthenticator";
import { ILoginHandler } from "./authentication/abstractions/ILoginHandler";
import { RegularLoginInputUserJwtTokenCreator } from "./authentication/implementations/regularLoginInputUserJwtTokenCreator";
import { ITokenCreator } from "./authentication/abstractions/ITokenCreator";
import { JwtTokenExtractor } from "./authorization/implementations/tokens/jwtTokenExtractor";
import { ITokenExtractor } from "./authorization/abstractions/tokens/ITokenExtractor";
import { IDecodedTokenRetriever } from "./authorization/abstractions/tokens/IDecodedTokenRetriever";
import { JwtRegularDecodedTokenRetriever } from "./authorization/implementations/tokens/jwtRegularDecodedTokenRetriever";
import { IMissionCreator } from "./authorizedLogics/missions/abstractions/IMissionCreator";
import { MockMissionCreator } from "./authorizedLogics/missions/implementations/implementations/mockMissionCreator";
import { RoutesConfiguration } from "./config/entities/routes";
import { TokensConfiguration } from "./config/entities/tokens";
import { PortsConfiguration } from "./config/entities/ports";
import { RegularLoginInputUser } from "./authentication/entities/input/regularLoginInputUser";
import { SSLConfiguration } from "./config/entities/ssl";
import { ConigurationConsts } from "./consts/configurationConsts";
import { SSLConsts } from "./consts/sslConsts";
import { IInputUserFromRequestExtractor } from "./authentication/abstractions/IInputUserFromRequestExtractor";
import { RegularLoginInputUserFromRequestExtractor } from "./authentication/implementations/regularLoginInputUserFromRequestExtractor";
import { IAuthenticationResponseCreator } from "./authentication/abstractions/IAuthenticationResponseCreator";
import { AuthenticationResponseCreator } from "./authentication/implementations/authenticationResponseCreator";
import { RegularLoginInputUserCacheUserAuthenticator } from "./cache/authentication/regularLoginInputUserCacheUserAuthenticator";
import { LDAPConfiguration } from "./config/entities/ldap";
import { RegularLoginInputUserActiveDirectoryUserAuthenticator } from './activeDirectory/authentication/regularLoginInputUserActiveDirectoryUserAuthenticator'
import { JwtRegularDecodedTokenParser } from "./authorization/implementations/tokens/jwtRegularDecodedTokenParser";
import { IDecodedTokenParser } from './authorization/abstractions/tokens/IDecodedTokenParser';
import { IAuthorizationHandler } from "./authorization/abstractions/IAuthorizationHandler";
import { TokenBasedAuthorizationHandler } from "./authorization/implementations/tokenBasedAuthorizationHandler";
import { IUserAuthorizer } from "./authorization/abstractions/IUserAuthorizer";
import { IAuthorizationFailureResponseCreator } from "./authorization/abstractions/IAuthorizationFailureResponseCreator";
import { RegularDecodedTokenAuthorizationFailureResponseCreator } from "./authorization/implementations/authorizationFailureResponseCreator";
import { RegularDecodedTokenActiveDirectoryUserAuthorizer } from "./activeDirectory/authorization/regularDecodedTokenActiveDirectoryUserAuthorizer";
import { IUserFinder } from "./common/abstractions/IUserFinder";
import { ActiveDirectoryByGroupNameUserFinder } from "./activeDirectory/userFinder/activeDirectoryByGroupNameUserFinder";
import { IUserInformationGetter } from "./authorizedLogics/userInformation/abstractions/IUserInformationGetter";
import { ActiveDirectoryUserInformation } from "./activeDirectory/entities/userInformation/activeDirectoryUserInformation";
import { UserInformationGetter } from "./authorizedLogics/userInformation/implementations/userInformationGetter";
import { IUserInformationRetriever } from "./authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { ActiveDirectoryUserInformationRetriever } from "./activeDirectory/userInformation/activeDirectoryUserInformationRetriever";
import { IInputUserAuthenticator } from "./authentication/abstractions/IInputUserAuthenticator";
import { IHttpResponseSender } from "./common/abstractions/IHttpResponseSender";
import { JsonHttpResponseSender } from "./common/implementations/JsonHttpResponseSender";
import { RegularDecodedToken } from "./authorization/entities/regularDecodedToken";

//#endregion

//#region environment variables

//dotenv can be used if we want to have one environment file.
// const dotenv = require("dotenv");
// dotenv.config();
//if we want to have many environments custom-env is the way
require("custom-env").env("dev", "./config/environments");
let mongoConnectionString = process.env.CONNECTION_STRING as string;

//#endregion

//#region configuration

const routesConfig = config.get<RoutesConfiguration>(ConigurationConsts.routes);
const tokensConfig = config.get<TokensConfiguration>(ConigurationConsts.tokens);
const portsConfig = config.get<PortsConfiguration>(ConigurationConsts.ports);
const sslConig = config.get<SSLConfiguration>(ConigurationConsts.ssl);
const ldapConfig = config.get<LDAPConfiguration>(ConigurationConsts.ldap);

//#region tokens

let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;
let tokenExpirationTime = tokensConfig.tokenExpirationTime;

//#endregion

//#region routes

let loginFromMongoDBRoute = routesConfig.loginFromMongoDBRoute;
let loginFromActiveDirectoryRoute = routesConfig.loginFromActiveDirectoryRoute;
let loginFromCacheRoute = routesConfig.loginFromCacheRoute;
let missionRoute = routesConfig.missionRoute;

//#endregion

//#region ports

let listeningPort = portsConfig.listeningPort;

//#endregion

//#region ssl

let passphrase = sslConig.passphrase;

//#endregion

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

//#endregion

//#region initialize objects

//#region common

let jsonHttpResponseSender: IHttpResponseSender = new JsonHttpResponseSender();

//#endregion

//#region authentication

let regularInputUserFromRequestExtractor: IInputUserFromRequestExtractor<RegularLoginInputUser> =
  new RegularLoginInputUserFromRequestExtractor();

let regularInputUserJwtTokenCreator: ITokenCreator<RegularLoginInputUser> = new RegularLoginInputUserJwtTokenCreator(
  tokenSecretOrPublicKey,
  tokenExpirationTime
);

let authenticationResponseCreator: IAuthenticationResponseCreator = new AuthenticationResponseCreator();

//#region MongoDB

let regularInputUserMongoDBUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
  new RegularLoginInputUserMongoDBUserAuthenticator(
    mongoConnectionString
  );

let regularInputUserMongoDBTokenBasedLoginHandler: ILoginHandler = new TokenBasedLoginHandler<RegularLoginInputUser>(
  regularInputUserFromRequestExtractor,
  regularInputUserMongoDBUserAuthenticator,
  regularInputUserJwtTokenCreator,
  authenticationResponseCreator,
  jsonHttpResponseSender
);

//#endregion

//#region ActiveDirectory

let regularInputUserActiveDirectoryUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
  new RegularLoginInputUserActiveDirectoryUserAuthenticator(
    activeDirectory
  );

let regularInputUserActiveDirectoryTokenBasedLoginHandler: ILoginHandler =
  new TokenBasedLoginHandler<RegularLoginInputUser>(
    regularInputUserFromRequestExtractor,
    regularInputUserActiveDirectoryUserAuthenticator,
    regularInputUserJwtTokenCreator,
    authenticationResponseCreator,
    jsonHttpResponseSender
  );

//#endregion

//#region Cache

let allowedUsers: RegularLoginInputUser[] = [new RegularLoginInputUser("china", "china")];
let regularInputUserCacheUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
  new RegularLoginInputUserCacheUserAuthenticator(
    allowedUsers
  );
let regularInputUserCacheTokenBasedLoginHandler: ILoginHandler =
  new TokenBasedLoginHandler<RegularLoginInputUser>(
    regularInputUserFromRequestExtractor,
    regularInputUserCacheUserAuthenticator,
    regularInputUserJwtTokenCreator,
    authenticationResponseCreator,
    jsonHttpResponseSender
  );

//#endregion

//#endregion

//#region authorization

//#region active directory

//#region group member

let activeDirectoryByGroupNameUserFinder: IUserFinder =
  new ActiveDirectoryByGroupNameUserFinder(activeDirectory, "Allowed Users");

let regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer: IUserAuthorizer<RegularDecodedToken> =
  new RegularDecodedTokenActiveDirectoryUserAuthorizer(activeDirectoryByGroupNameUserFinder);

//#endregion

//#endregion

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let decodedJWTConverter: IDecodedTokenParser = new JwtRegularDecodedTokenParser();

let regularDecodedTokenRetriever: IDecodedTokenRetriever<RegularDecodedToken> =
  new JwtRegularDecodedTokenRetriever(tokenSecretOrPublicKey, jwtTokenExtractor, decodedJWTConverter);

let regularDecodedTokenAuthorizationFailureResponseCreator: IAuthorizationFailureResponseCreator<RegularDecodedToken> =
  new RegularDecodedTokenAuthorizationFailureResponseCreator();

let authorizationHandler: IAuthorizationHandler = new TokenBasedAuthorizationHandler(
  regularDecodedTokenRetriever,
  regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer,
  regularDecodedTokenAuthorizationFailureResponseCreator,
  jsonHttpResponseSender);

//#endregion

//#region user information

//#region active directory

let activeDirectoryUserInformationRetriever: IUserInformationRetriever<ActiveDirectoryUserInformation> =
  new ActiveDirectoryUserInformationRetriever(activeDirectory);

let activeDirectoryUserInformationGetter: IUserInformationGetter<ActiveDirectoryUserInformation> =
  new UserInformationGetter<ActiveDirectoryUserInformation>(regularDecodedTokenRetriever, activeDirectoryUserInformationRetriever);

//#endregion

//#endregion

//#region missions

let mockMissionCreator: IMissionCreator = new MockMissionCreator();

//#endregion

//#endregion

//#region express API

const app: express.Application = express();

app.use(
  cors(),
  bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json()
);

//#region log in API

app.post(loginFromMongoDBRoute, (req: express.Request, res: express.Response) => {
  regularInputUserMongoDBTokenBasedLoginHandler.handleLogin(req, res);
});

app.post(loginFromActiveDirectoryRoute, (req: express.Request, res: express.Response) => {
  regularInputUserActiveDirectoryTokenBasedLoginHandler.handleLogin(req, res);
})

app.post(loginFromCacheRoute, (req: express.Request, res: express.Response) => {
  regularInputUserCacheTokenBasedLoginHandler.handleLogin(req, res);
});

//#endregion

app.get("/user/information", async (req: express.Request, res: express.Response) => {
  let isAuthorized = await authorizationHandler.handleAuthorization(req, res);
  if (isAuthorized) {
    let userInformation = await activeDirectoryUserInformationGetter.getUserInformation(req, res);
    res.json(userInformation);
  }
});

app.post(missionRoute, async (req: express.Request, res: express.Response) => {
  let isAuthorized = await authorizationHandler.handleAuthorization(req, res);
  if (isAuthorized) mockMissionCreator.CreateMission(req, res);
});

https
  .createServer(
    {
      key: fs.readFileSync(SSLConsts.encryptionKeyFileLocation),
      cert: fs.readFileSync(SSLConsts.certificationFileLocation),
      passphrase: passphrase
    },
    app
  )
  .listen(listeningPort, () =>
    console.log(`Server is listening on port: ${listeningPort}`)
  );

//#endregion
