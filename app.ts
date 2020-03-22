//#region outer imports

import express = require("express");
import https = require("https");
import fs = require("fs");
import bodyParser = require("body-parser");
import config = require("config");

//#endregion

//#region inner imports

import { AsyncLoginHandler } from "./login/implementations/loginHandler/asyncLoginHandler";
import { IAsyncUserAuthenticator } from "./login/abstractions/userAuthenticator/IAsyncUserAuthenticator";
import { MongoDBAsyncUserAuthenticator } from "./login/implementations/userAuthenticator/mongoDBAsyncUserAuthenticator";
import { ILoginHandler } from "./login/abstractions/ILoginHandler";
import { JwtTokenRetriever } from "./tokens/implementations/jwtTokenRetriever";
import { ITokenRetriever } from "./tokens/abstractions/ITokenRetriever";
import { JwtTokenExtractor } from "./tokens/implementations/jwtTokenExtractor";
import { ITokenExtractor } from "./tokens/abstractions/ITokenExtractor";
import { ITokenValidator } from "./tokens/abstractions/ITokenValidator";
import { JwtTokenValidator } from "./tokens/implementations/jwtTokenValidator";
import { IMissionCreator } from "./missions/abstractions/IMissionCreator";
import { MockMissionCreator } from "./missions/implementations/mockMissionCreator";
import { RoutesConfiguration } from "./config/entities/routes";
import { TokensConfiguration } from "./config/entities/tokens";
import { PortsConfiguration } from "./config/entities/ports";
import { ISyncUserAuthenticator } from "./login/abstractions/userAuthenticator/ISyncUserAuthenticator";
import { CacheSyncUserAuthenticator } from "./login/implementations/userAuthenticator/CacheSyncUserAuthenticator";
import { SyncLoginHandler } from "./login/implementations/loginHandler/syncLoginHandler";
import { User } from "./entities/user";
import { SSLConfiguration } from "./config/entities/ssl";
import { ConigurationConsts } from "./consts/configurationConsts";
import { SSLConsts } from "./consts/sslConsts";
import { IUserFromRequestExtractor } from "./login/abstractions/IUserFromRequestExtractor";
import { UserFromRequestExtractor } from "./login/implementations/userFromRequestExtractor";
import { IAuthenticationHttpResponseCreator } from "./login/abstractions/IAuthenticationHttpResponseCreator";
import { AuthenticationHttpResponseCreator } from "./login/implementations/authenticationHttpResponseCreator";

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

//#region tokens

let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;
let tokenExpirationTime = tokensConfig.tokenExpirationTime;

//#endregion

//#region routes

let loginFromMongoDBRoute = routesConfig.loginFromMongoDBRoute;
let loginFromCacheRoute = routesConfig.loginFromCacheRoute;
let missionRoute = routesConfig.missionRoute;

//#endregion

//#region ports

let listeningPort = portsConfig.listeningPort;

//#endregion

//#region ssl

let passphrase = sslConig.passphrase;

//#endregion

//#endregion

//#region initialize objects

//#region log in

let userFromRequestExtractor: IUserFromRequestExtractor = new UserFromRequestExtractor();

let jwtTokenRetriever: ITokenRetriever = new JwtTokenRetriever(
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
  jwtTokenRetriever,
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
  jwtTokenRetriever,
  authenticationHttpResponseCreator
);

//#endregion

//#endregion

//#region token validator

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let jwtTokenValidator: ITokenValidator = new JwtTokenValidator(
  tokenSecretOrPublicKey,
  jwtTokenExtractor
);

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

app.post(loginFromCacheRoute, (req, res) => {
  syncLoginHandler.handleLogin(req, res);
});

//#endregion

app.post(missionRoute, (req, res) => {
  jwtTokenValidator.ValidateToken(req, res, () => {
    mockMissionCreator.CreateMission(req, res);
  });
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
