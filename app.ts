//#region outer imports

import express = require("express");
import bodyParser = require("body-parser");
import config = require("config");

//#endregion

//#region inner imports

import { AsyncLoginHandler } from "./login/implementations/asyncLoginHandler";
import { IAsyncUserRetriever } from "./login/abstractions/IAsyncUserRetriever";
import { MongoDBAsyncUserRetriever } from "./login/implementations/mongoDBAsyncUserRetriever";
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

const routesConfig = config.get<RoutesConfiguration>("routes");
const tokensConfig = config.get<TokensConfiguration>("tokens");
const portsConfig = config.get<PortsConfiguration>("ports");

//#region tokens

let tokenSecretOrPublicKey = tokensConfig.tokenSecretOrPublicKey;
let tokenExpirationTime = tokensConfig.tokenExpirationTime;

//#endregion

//#region routes

let loginRoute = routesConfig.loginRoute;
let missionRoute = routesConfig.missionRoute;

//#endregion

//#region ports

let listeningPort = portsConfig.listeningPort;

//#endregion

//#endregion

//#region initialize objects

//#region log in

let jwtTokenRetriever: ITokenRetriever = new JwtTokenRetriever(
  tokenSecretOrPublicKey,
  tokenExpirationTime
);
let mongoDBAsyncUserRetriever: IAsyncUserRetriever = new MongoDBAsyncUserRetriever(
  mongoConnectionString
);
let loginHandler: ILoginHandler<Promise<void>> = new AsyncLoginHandler(
  mongoDBAsyncUserRetriever,
  jwtTokenRetriever
);

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

app.post(loginRoute, (req, res) => {
  loginHandler.HandleLogin(req, res);
});

app.post(missionRoute, (req, res) => {
  jwtTokenValidator.ValidateToken(req, res, () => {
    mockMissionCreator.CreateMission(req, res);
  });
});

app.listen(listeningPort, () =>
  console.log(`Server is listening on port: ${listeningPort}`)
);

//#endregion
