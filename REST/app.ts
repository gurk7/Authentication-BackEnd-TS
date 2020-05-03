//#region outer imports
import "reflect-metadata"
import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import config from "config";

//#region js packages

const AD = require("ad");

//#endregion

//#endregion

//#region inner imports

import { TokenBasedRESTLoginHandler } from "./authentication/implementations/tokenBasedRESTloginHandler";
import { RegularLoginInputUserMongoDBUserAuthenticator } from "../mongo/authentication/regularLoginInputUserMongoDBUserAuthenticator";
import { IRESTLoginHandler } from "./authentication/abstractions/IRESTLoginHandler";
import { RegularLoginInputUserJwtTokenCreator } from "../authentication/implementations/regularLoginInputUserJwtTokenCreator";
import { ITokenCreator } from "../authentication/abstractions/ITokenCreator";
import { JwtTokenExtractor } from "./authorization/implementations/request/jwtTokenExtractor";
import { IDecodedTokenRetriever } from "./authorization/abstractions/request/IDecodedTokenRetriever";
import { JwtRegularDecodedTokenRetriever } from "./authorization/implementations/request/jwtRegularDecodedTokenRetriever";
import { IMissionCreator } from "../authorizedLogics/missions/abstractions/IMissionCreator";
import { MockMissionCreator } from "../authorizedLogics/missions/implementations/implementations/mockMissionCreator";
import { RoutesConfiguration } from "../config/entities/routes";
import { TokensConfiguration } from "../config/entities/tokens";
import { PortsConfiguration } from "../config/entities/ports";
import { RegularLoginInputUser } from "../authentication/entities/input/regularLoginInputUser";
import { SSLConfiguration } from "../config/entities/ssl";
import { ConigurationConsts } from "../consts/configurationConsts";
import { SSLConsts } from "../consts/sslConsts";
import { IInputUserFromRequestExtractor } from "./authentication/abstractions/request/IInputUserFromRequestExtractor";
import { RegularLoginInputUserFromRequestExtractor } from "./authentication/implementations/request/regularLoginInputUserFromRequestExtractor";
import { IAuthenticationResponseCreator } from "./authentication/abstractions/response/IAuthenticationResponseCreator";
import { AuthenticationResponseCreator } from "./authentication/implementations/response/authenticationResponseCreator";
import { RegularLoginInputUserCacheUserAuthenticator } from "../cache/authentication/regularLoginInputUserCacheUserAuthenticator";
import { LDAPConfiguration } from "../config/entities/ldap";
import { RegularLoginInputUserActiveDirectoryUserAuthenticator } from '../activeDirectory/authentication/regularLoginInputUserActiveDirectoryUserAuthenticator'
import { JwtRegularDecodedTokenParser } from "../authorization/implementations/jwtRegularDecodedTokenParser";
import { IDecodedTokenParser } from '../authorization/abstractions/IDecodedTokenParser';
import { IRESTAuthorizationHandler } from "./authorization/abstractions/IRESTAuthorizationHandler";
import { TokenBasedAuthorizationHandler } from "./authorization/implementations/tokenBasedRESTAuthorizationHandler";
import { IUserAuthorizer } from "../authorization/abstractions/IUserAuthorizer";
import { IAuthorizationFailureResponseCreator } from "./authorization/abstractions/response/IAuthorizationFailureResponseCreator";
import { RegularDecodedTokenAuthorizationFailureResponseCreator } from "./authorization/implementations/response/regularDecodedTokenAuthorizationFailureResponseCreator";
import { RegularDecodedTokenActiveDirectoryUserAuthorizer } from "../activeDirectory/authorization/regularDecodedTokenActiveDirectoryUserAuthorizer";
import { IUserFinder } from "../common/abstractions/IUserFinder";
import { ActiveDirectoryByGroupNameUserFinder } from "../activeDirectory/userFinder/activeDirectoryByGroupNameUserFinder";
import { IUserInformationGetter } from "../authorizedLogics/userInformation/abstractions/IUserInformationGetter";
import { UserInformationGetter } from "../authorizedLogics/userInformation/implementations/userInformationGetter";
import { IUserInformationRetriever } from "../authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { ActiveDirectoryUserInformationRetriever } from "../activeDirectory/userInformation/activeDirectoryUserInformationRetriever";
import { IInputUserAuthenticator } from "../authentication/abstractions/IInputUserAuthenticator";
import { IHttpResponseSender } from "../common/abstractions/IHttpResponseSender";
import { JsonHttpResponseSender } from "../common/implementations/JsonHttpResponseSender";
import { RegularDecodedToken } from "../authorization/entities/regularDecodedToken";
import { ITokenExtractor } from "./authorization/abstractions/request/ITokenExtractor";
import { IAuthenticationHandler } from "../authentication/abstractions/IAuthenticationHandler";
import { RESTAuthenticationHandler } from "./authentication/implementations/RESTAuthenticationHandler";
import { MockUserInformationRetriever } from "../cache/userInformation/mockUserInformationRetriever";
import { RegularDecodedTokenCacheUserAuthorizer } from "../cache/authorization/regularDecodedTokenCacheUserAuthorizer";

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

let mongoRESTauthenticationHandler: IAuthenticationHandler<RegularLoginInputUser> =
  new RESTAuthenticationHandler(regularInputUserMongoDBUserAuthenticator,
    regularInputUserJwtTokenCreator);

let regularInputUserMongoDBTokenBasedLoginHandler: IRESTLoginHandler = new TokenBasedRESTLoginHandler<RegularLoginInputUser>(
  regularInputUserFromRequestExtractor,
  mongoRESTauthenticationHandler,
  authenticationResponseCreator,
  jsonHttpResponseSender
);

//#endregion

//#region ActiveDirectory

let regularInputUserActiveDirectoryUserAuthenticator: IInputUserAuthenticator<RegularLoginInputUser> =
  new RegularLoginInputUserActiveDirectoryUserAuthenticator(
    activeDirectory
  );

let activeDirectoryRESTauthenticationHandler: IAuthenticationHandler<RegularLoginInputUser> =
  new RESTAuthenticationHandler(regularInputUserActiveDirectoryUserAuthenticator,
    regularInputUserJwtTokenCreator);

let regularInputUserActiveDirectoryTokenBasedLoginHandler: IRESTLoginHandler =
  new TokenBasedRESTLoginHandler<RegularLoginInputUser>(
    regularInputUserFromRequestExtractor,
    activeDirectoryRESTauthenticationHandler,
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

let cacheRESTauthenticationHandler: IAuthenticationHandler<RegularLoginInputUser> =
  new RESTAuthenticationHandler(regularInputUserCacheUserAuthenticator,
    regularInputUserJwtTokenCreator);

let regularInputUserCacheTokenBasedLoginHandler: IRESTLoginHandler =
  new TokenBasedRESTLoginHandler<RegularLoginInputUser>(
    regularInputUserFromRequestExtractor,
    cacheRESTauthenticationHandler,
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

//#region cache

let regularDecodedTokenCacheUserAuthorizer: IUserAuthorizer<RegularDecodedToken> =
  new RegularDecodedTokenCacheUserAuthorizer(["china"]);

//#endregion

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let decodedJWTConverter: IDecodedTokenParser = new JwtRegularDecodedTokenParser();

let regularDecodedTokenRetriever: IDecodedTokenRetriever<RegularDecodedToken> =
  new JwtRegularDecodedTokenRetriever(tokenSecretOrPublicKey, jwtTokenExtractor, decodedJWTConverter);

let regularDecodedTokenAuthorizationFailureResponseCreator: IAuthorizationFailureResponseCreator<RegularDecodedToken> =
  new RegularDecodedTokenAuthorizationFailureResponseCreator();

let activeDirectoryAuthorizationHandler: IRESTAuthorizationHandler =
  new TokenBasedAuthorizationHandler(
    regularDecodedTokenRetriever,
    regularDecodedTokenActiveDirectoryByGroupMemberUserAuthorizer,
    regularDecodedTokenAuthorizationFailureResponseCreator,
    jsonHttpResponseSender);

let cacheAuthorizationHandler: IRESTAuthorizationHandler =
  new TokenBasedAuthorizationHandler(
    regularDecodedTokenRetriever,
    regularDecodedTokenCacheUserAuthorizer,
    regularDecodedTokenAuthorizationFailureResponseCreator,
    jsonHttpResponseSender);

//#endregion

//#region user information

//#region active directory

let activeDirectoryUserInformationRetriever: IUserInformationRetriever<RegularDecodedToken> =
  new ActiveDirectoryUserInformationRetriever(activeDirectory);

let activeDirectoryUserInformationGetter: IUserInformationGetter =
  new UserInformationGetter(regularDecodedTokenRetriever, activeDirectoryUserInformationRetriever);

//#endregion

//#region cache

let cacheMockUserInformationRetriever: IUserInformationRetriever<RegularDecodedToken> =
  new MockUserInformationRetriever();

let cacheMockUserInformationGetter: IUserInformationGetter =
  new UserInformationGetter(regularDecodedTokenRetriever, cacheMockUserInformationRetriever);

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
  try {
    let isAuthorized = await cacheAuthorizationHandler.handleAuthorization(req, res);
    if (!isAuthorized) {
      res.status(403).json("user is not authorized");
      return;
    }
  }
  catch (error) {
    res.status(401).json("user is not authenticated");
    return;
  }
  try {
    let userInformation = await cacheMockUserInformationGetter.getUserInformation(req);
    res.json(userInformation);
  }
  catch (error) {
    console.log(error);
    res.status(500).json("error happened while trying to retrieve user information");
  }
});

app.post(missionRoute, async (req: express.Request, res: express.Response) => {
  let isAuthorized = await activeDirectoryAuthorizationHandler.handleAuthorization(req, res);
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
