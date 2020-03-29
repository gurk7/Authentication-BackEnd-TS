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

import { AsyncLoginHandler } from "./authentication/implementations/loginHandler/asyncLoginHandler";
import { IAsyncUserAuthenticator } from "./authentication/abstractions/userAuthenticator/IAsyncUserAuthenticator";
import { MongoDBAsyncUserAuthenticator } from "./authentication/implementations/userAuthenticator/mongoDBAsyncUserAuthenticator";
import { ILoginHandler } from "./authentication/abstractions/loginHandler/ILoginHandler";
import { JwtTokenCreator } from "./authentication/implementations/tokens/jwtTokenCreator";
import { ITokenCreator } from "./authentication/abstractions/tokens/ITokenCreator";
import { JwtTokenExtractor } from "./authorization/implementations/tokens/jwtTokenExtractor";
import { ITokenExtractor } from "./authorization/abstractions/tokens/ITokenExtractor";
import { IDecodedTokenRetriever } from "./authorization/abstractions/tokens/IDecodedTokenRetriever";
import { DecodedJWTTokenRetriever } from "./authorization/implementations/tokens/decodedJWTTokenRetriever";
import { IMissionCreator } from "./missions/abstractions/IMissionCreator";
import { MockMissionCreator } from "./missions/implementations/mockMissionCreator";
import { RoutesConfiguration } from "./config/entities/routes";
import { TokensConfiguration } from "./config/entities/tokens";
import { PortsConfiguration } from "./config/entities/ports";
import { ISyncUserAuthenticator } from "./authentication/abstractions/userAuthenticator/ISyncUserAuthenticator";
import { SyncLoginHandler } from "./authentication/implementations/loginHandler/syncLoginHandler";
import { User } from "./entities/authentication/user";
import { SSLConfiguration } from "./config/entities/ssl";
import { ConigurationConsts } from "./consts/configurationConsts";
import { SSLConsts } from "./consts/sslConsts";
import { IUserFromRequestExtractor } from "./authentication/abstractions/IUserFromRequestExtractor";
import { UserFromRequestExtractor } from "./authentication/implementations/userFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "./authentication/abstractions/IAuthenticationHttpResponseCreator";
import { AuthenticationHttpResponseCreator } from "./authentication/implementations/authenticationHttpResponseCreator";
import { CacheSyncUserAuthenticator } from "./authentication/implementations/userAuthenticator/cacheSyncUserAuthenticator";
import { LDAPConfiguration } from "./config/entities/ldap";
import { ActiveDirectoryAsyncUserAuthenticator } from './authentication/implementations/userAuthenticator/activeDirectory/activeDirectoryAsyncUserAuthenticator'
import { ObjectToDecodedJWTConverter } from "./authorization/implementations/tokens/objectToDecodedJWTConverter";
import { IObjectToDecodedJWTConverter } from './authorization/abstractions/tokens/IObjectToDecodedJWTConverter';
import { IUserAuthorizer } from "./authorization/abstractions/userAuthorizer/IUserAuthorizer";
import { ActiveDirectoryByGroupMemberUserAuthorizer } from "./authorization/implementations/userAuthorizer/activeDirectory/activeDirectoryByGroupMemberUserAuthorizer";
import { IAuthorizationHandler } from "./authorization/abstractions/authorizationHandler/IAuthorizationHandler";
import { AuthorizationHandler } from "./authorization/implementations/authorizationHandler/authorizationHandler";

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

//#region log in

let userFromRequestExtractor: IUserFromRequestExtractor = new UserFromRequestExtractor();

let jwtTokenCreator: ITokenCreator = new JwtTokenCreator(
  tokenSecretOrPublicKey,
  tokenExpirationTime
);

let authenticationHttpResponseCreator: IAuthenticationHttpResponseCreator = new AuthenticationHttpResponseCreator();

//#region async (MongoDB)

let mongoDBAsyncUserAuthenticator: IAsyncUserAuthenticator = new MongoDBAsyncUserAuthenticator(
  mongoConnectionString
);
let asyncLoginHandler: ILoginHandler<Promise<void>> = new AsyncLoginHandler(
  userFromRequestExtractor,
  mongoDBAsyncUserAuthenticator,
  jwtTokenCreator,
  authenticationHttpResponseCreator
);

//#endregion

//#region async (ActiveDirectory)

let activeDirectoryAsyncUserAuthenticator: IAsyncUserAuthenticator = new ActiveDirectoryAsyncUserAuthenticator(
  activeDirectory
);
let asyncActiveDirectoryLoginHandler: ILoginHandler<Promise<void>> = new AsyncLoginHandler(
  userFromRequestExtractor,
  activeDirectoryAsyncUserAuthenticator,
  jwtTokenCreator,
  authenticationHttpResponseCreator
);

//#endregion

//#region sync (Cache)

let allowedUsers: User[] = [new User("china", "china")];
let cacheSyncUserAuthenticator: ISyncUserAuthenticator = new CacheSyncUserAuthenticator(
  allowedUsers
);
let syncLoginHandler: ILoginHandler<void> = new SyncLoginHandler(
  userFromRequestExtractor,
  cacheSyncUserAuthenticator,
  jwtTokenCreator,
  authenticationHttpResponseCreator
);

//#endregion

//#endregion

//#region authorization

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let decodedJWTConverter: IObjectToDecodedJWTConverter = new ObjectToDecodedJWTConverter();
let decodedTokenRetriever: IDecodedTokenRetriever = new DecodedJWTTokenRetriever(tokenSecretOrPublicKey, jwtTokenExtractor, decodedJWTConverter);

let userAuthorizer: IUserAuthorizer = new ActiveDirectoryByGroupMemberUserAuthorizer(activeDirectory, "Allowed Users");

let authorizationHandler: IAuthorizationHandler = new AuthorizationHandler(decodedTokenRetriever, userAuthorizer);

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
  asyncLoginHandler.handleLogin(req, res);
});

app.post(loginFromActiveDirectory, (req, res) => {
  asyncActiveDirectoryLoginHandler.handleLogin(req, res);
})

app.post(loginFromCacheRoute, (req, res) => {
  syncLoginHandler.handleLogin(req, res);
});

//#endregion

app.post(missionRoute, (req, res) => {
  authorizationHandler.handleAuthorization(req, res, () =>
    mockMissionCreator.CreateMission(req, res)
  );
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
