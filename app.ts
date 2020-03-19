import express = require("express");
import bodyParser = require("body-parser");

import { LoginHandler } from "./login/implementations/loginHandler";
import { MongoUserRetriever } from "./login/implementations/mongoUserRetriever";
import { IUserRetriever } from "./login/abstractions/IUserRetriever";
import { ILoginHandler } from "./login/abstractions/ILoginHandler";
import { JwtTokenRetriever } from "./tokens/implementations/jwtTokenRetriever";
import { ITokenRetriever } from "./tokens/abstractions/ITokenRetriever";

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

const port: number = 3000;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
