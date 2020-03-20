import express = require("express");
import bodyParser = require("body-parser");
const config = require("config");

//dotenv can be used if we want to have one environment file.
// const dotenv = require("dotenv");
// dotenv.config();
//if we want to have many environments custom-env is the way
require("custom-env").env("dev", "./config/environments");
let mongoConnectionString = process.env.CONNECTION_STRING as string;
console.log(`yaya ${mongoConnectionString}`);

import { LoginHandler } from "./login/implementations/loginHandler";
import { MongoUserRetriever } from "./login/implementations/mongoUserRetriever";
import { IUserRetriever } from "./login/abstractions/IUserRetriever";
import { ILoginHandler } from "./login/abstractions/ILoginHandler";
import { JwtTokenRetriever } from "./tokens/implementations/jwtTokenRetriever";
import { ITokenRetriever } from "./tokens/abstractions/ITokenRetriever";
import { JwtTokenExtractor } from "./tokens/implementations/jwtTokenExtractor";
import { ITokenExtractor } from "./tokens/abstractions/ITokenExtractor";
import { ITokenValidator } from "./tokens/abstractions/ITokenValidator";
import { JwtTokenValidator } from "./tokens/implementations/jwtTokenValidator";
import { IMissionCreator } from "./missions/abstractions/IMissionCreator";
import { MockMissionCreator } from "./missions/implementations/mockMissionCreator";

const routesConfig = config.get("routes");
const tokensConfig = config.get("tokens");
const portsConfig = config.get("ports");

let tokenSecretOrPublicKey = tokensConfig.get("tokenSecretOrPublicKey");
let tokenExpirationTime = tokensConfig.get("tokenExpirationTime");

let loginRoute = routesConfig.get("loginRoute");
let missionRoute = routesConfig.get("missionRoute");

let listeningPort = portsConfig.get("listeningPort");

// Create a new express application instance
const app: express.Application = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json()
);

let jwtTokenRetriever: ITokenRetriever = new JwtTokenRetriever(
  tokenSecretOrPublicKey,
  tokenExpirationTime
);
let mongoUserRetriever: IUserRetriever = new MongoUserRetriever(
  mongoConnectionString
);
let loginHandler: ILoginHandler = new LoginHandler(
  mongoUserRetriever,
  jwtTokenRetriever
);

app.post(loginRoute, (req, res) => {
  loginHandler.HandleLogin(req, res);
});

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let jwtTokenValidator: ITokenValidator = new JwtTokenValidator(
  tokenSecretOrPublicKey,
  jwtTokenExtractor
);
let mockMissionCreator: IMissionCreator = new MockMissionCreator();

app.post(missionRoute, (req, res) => {
  jwtTokenValidator.ValidateToken(req, res, () => {
    mockMissionCreator.CreateMission(req, res);
  });
});

const port: number = listeningPort;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
