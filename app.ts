//#region outer imports

import express = require("express");
import https = require("https");
import fs = require("fs");
import bodyParser = require("body-parser");
import config = require("config");

//#region js packages

const AD = require("ad");

//#endregion

//#endregion

//#region inner imports

import { LoginHandler } from "./authentication/implementations/loginHandler";
import { MongoDBUserAuthenticator } from "./mongo/authentication/mongoDBUserAuthenticator";
import { ILoginHandler } from "./authentication/abstractions/ILoginHandler";
import { JwtTokenCreator } from "./authentication/implementations/jwtTokenCreator";
import { ITokenCreator } from "./authentication/abstractions/ITokenCreator";
import { JwtTokenExtractor } from "./authorization/implementations/tokens/jwtTokenExtractor";
import { ITokenExtractor } from "./authorization/abstractions/tokens/ITokenExtractor";
import { IDecodedTokenRetriever } from "./authorization/abstractions/tokens/IDecodedTokenRetriever";
import { DecodedJWTTokenRetriever } from "./authorization/implementations/tokens/decodedJWTTokenRetriever";
import { IMissionCreator } from "./authorizedLogics/missions/abstractions/IMissionCreator";
import { MockMissionCreator } from "./authorizedLogics/missions/implementations/implementations/mockMissionCreator";
import { RoutesConfiguration } from "./config/entities/routes";
import { TokensConfiguration } from "./config/entities/tokens";
import { PortsConfiguration } from "./config/entities/ports";
import { User } from "./common/entities/authentication/user";
import { SSLConfiguration } from "./config/entities/ssl";
import { ConigurationConsts } from "./consts/configurationConsts";
import { SSLConsts } from "./consts/sslConsts";
import { IUserFromRequestExtractor } from "./authentication/abstractions/IUserFromRequestExtractor";
import { UserFromRequestExtractor } from "./authentication/implementations/userFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "./authentication/abstractions/IAuthenticationHttpResponseCreator";
import { AuthenticationHttpResponseCreator } from "./authentication/implementations/authenticationHttpResponseCreator";
import { CacheSyncUserAuthenticator } from "./cache/authentication/cacheUserAuthenticator";
import { LDAPConfiguration } from "./config/entities/ldap";
import { ActiveDirectoryUserAuthenticator } from './activeDirectory/authentication/activeDirectoryUserAuthenticator'
import { ObjectToDecodedJWTConverter } from "./authorization/implementations/tokens/objectToDecodedJWTConverter";
import { IObjectToDecodedJWTConverter } from './authorization/abstractions/tokens/IObjectToDecodedJWTConverter';
import { IAuthorizationHandler } from "./authorization/abstractions/IAuthorizationHandler";
import { AuthorizationHandler } from "./authorization/implementations/authorizationHandler";
import { IUserAuthorizer } from "./authorization/abstractions/IUserAuthorizer";
import { IAuthorizationFailureHttpResponseCreator } from "./authorization/abstractions/IAuthorizationFailureHttpResponseCreator";
import { AuthorizationFailureHttpResponseCreator } from "./authorization/implementations/authorizationFailureHttpResponseCreator";
import { ActiveDirectoryUserAuthorizer } from "./activeDirectory/authorization/activeDirectoryUserAuthorizer";
import { IUserFinder } from "./common/abstractions/IUserFinder";
import { ActiveDirectoryByGroupNameUserFinder } from "./activeDirectory/userFinder/activeDirectoryByGroupNameUserFinder";
import { IUserInformationGetter } from "./authorizedLogics/userInformation/abstractions/IUserInformationGetter";
import { ActiveDirectoryUserInformation } from "./activeDirectory/entities/userInformation/activeDirectoryUserInformation";
import { UserInformationGetter } from "./authorizedLogics/userInformation/implementations/userInformationGetter";
import { IUserInformationRetriever } from "./authorizedLogics/userInformation/abstractions/IUserInformationRetriever";
import { ActiveDirectoryUserInformationRetriever } from "./activeDirectory/userInformation/activeDirectoryUserInformationRetriever";
import { IUserAuthenticator } from "./authentication/abstractions/IUserAuthenticator";

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
let loginFromActiveDirectory = routesConfig.loginFromActiveDirectoryRoute;
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

//#region authentication

let userFromRequestExtractor: IUserFromRequestExtractor = new UserFromRequestExtractor();

let jwtTokenCreator: ITokenCreator = new JwtTokenCreator(
  tokenSecretOrPublicKey,
  tokenExpirationTime
);

let authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator = new AuthenticationHttpResponseCreator();

//#region MongoDB

let mongoDBUserAuthenticator: IUserAuthenticator = new MongoDBUserAuthenticator(
  mongoConnectionString
);
let mongoDBLoginHandler: ILoginHandler = new LoginHandler(
  userFromRequestExtractor,
  mongoDBUserAuthenticator,
  jwtTokenCreator,
  authenticationHttpResponseCreator
);

//#endregion

//#region ActiveDirectory

let activeDirectoryAsyncUserAuthenticator: IUserAuthenticator = new ActiveDirectoryUserAuthenticator(
  activeDirectory
);
let activeDirectoryLoginHandler: ILoginHandler = new LoginHandler(
  userFromRequestExtractor,
  activeDirectoryAsyncUserAuthenticator,
  jwtTokenCreator,
  authenticationHttpResponseCreator
);

//#endregion

//#region Cache

let allowedUsers: User[] = [new User("china", "china")];
let cacheUserAuthenticator: IUserAuthenticator = new CacheSyncUserAuthenticator(
  allowedUsers
);
let cacheLoginHandler: ILoginHandler = new LoginHandler(
  userFromRequestExtractor,
  cacheUserAuthenticator,
  jwtTokenCreator,
  authenticationHttpResponseCreator
);

//#endregion

//#endregion

//#region authorization

//#region active directory

//#region group member

let activeDirectoryByGroupNameUserFinder: IUserFinder = new ActiveDirectoryByGroupNameUserFinder(activeDirectory, "Allowed Users");
let activeDirectoryByGroupMemberUserAuthorizer: IUserAuthorizer = new ActiveDirectoryUserAuthorizer(activeDirectoryByGroupNameUserFinder);

//#endregion

//#endregion

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let decodedJWTConverter: IObjectToDecodedJWTConverter = new ObjectToDecodedJWTConverter();
let decodedTokenRetriever: IDecodedTokenRetriever = new DecodedJWTTokenRetriever(tokenSecretOrPublicKey, jwtTokenExtractor, decodedJWTConverter);
let authorizationFailureHttpResponseCreator: IAuthorizationFailureHttpResponseCreator = new AuthorizationFailureHttpResponseCreator();

let authorizationHandler: IAuthorizationHandler = new AuthorizationHandler(decodedTokenRetriever, activeDirectoryByGroupMemberUserAuthorizer, authorizationFailureHttpResponseCreator);

//#endregion

//#region user information

//#region active directory

let activeDirectoryUserInformationRetriever: IUserInformationRetriever<ActiveDirectoryUserInformation> = 
new ActiveDirectoryUserInformationRetriever(activeDirectory);

let activeDirectoryUserInformationGetter : IUserInformationGetter<ActiveDirectoryUserInformation> = 
new UserInformationGetter<ActiveDirectoryUserInformation>(decodedTokenRetriever, activeDirectoryUserInformationRetriever);

//#endregion

//#endregion

//#region missions

let mockMissionCreator: IMissionCreator = new MockMissionCreator();

//#endregion

//#endregion

//#region express API

const app: express.Application = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json()
);

//#region log in API

app.post(loginFromMongoDBRoute, (req, res) => {
  mongoDBLoginHandler.handleLogin(req, res);
});

app.post(loginFromActiveDirectory, (req, res) => {
  activeDirectoryLoginHandler.handleLogin(req, res);
})

app.post(loginFromCacheRoute, (req, res) => {
  cacheLoginHandler.handleLogin(req, res);
});

//#endregion

app.get("/user/information", async (req, res) => {
  let isAuthorized = await authorizationHandler.handleAuthorization(req, res);
  if(isAuthorized)
  {
    let userInformation = await activeDirectoryUserInformationGetter.getUserInformation(req, res);
    res.json(userInformation);
  }
});

app.post(missionRoute, async (req, res) => {
  let isAuthorized = await authorizationHandler.handleAuthorization(req, res);
  if(isAuthorized) mockMissionCreator.CreateMission(req, res);
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
