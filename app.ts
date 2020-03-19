import express = require("express");
import bodyParser = require("body-parser");

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

// Create a new express application instance
const app: express.Application = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  }),
  bodyParser.json()
);

app.get("/", function(req, res) {
  res.send("Hello World!");
});

var url = "mongodb://localhost:27017/";
let tokenSecretOrPublicKey = "worldisfullofdevelopers";
let tokenExpirationTime = "24h";

let jwtTokenRetriever: ITokenRetriever = new JwtTokenRetriever(
  tokenSecretOrPublicKey,
  tokenExpirationTime
);
let mongoUserRetriever: IUserRetriever = new MongoUserRetriever(url);
let loginHandler: ILoginHandler = new LoginHandler(
  mongoUserRetriever,
  jwtTokenRetriever
);

app.post("/login", (req, res) => {
  loginHandler.HandleLogin(req, res);
});

let jwtTokenExtractor: ITokenExtractor = new JwtTokenExtractor();
let jwtTokenValidator: ITokenValidator = new JwtTokenValidator(
  tokenSecretOrPublicKey,
  jwtTokenExtractor
);
let mockMissionCreator: IMissionCreator = new MockMissionCreator();

app.post("/mission", (req, res, next) => {
  jwtTokenValidator.ValidateToken(req, res, () => {
    mockMissionCreator.CreateMission(req, res);
  });
});

const port: number = 3000;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
