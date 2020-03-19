import express = require("express");
import bodyParser = require("body-parser");

import { LoginHandler } from "./login/implementations/loginHandler";
import { MongoUserRetriever } from "./login/implementations/mongoUserRetriever";

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

let mongoUserRetriever = new MongoUserRetriever(url);
console.log(mongoUserRetriever);
let loginHandler = new LoginHandler(mongoUserRetriever, tokenSecretOrPublicKey);
console.log(loginHandler);

app.post("/login", loginHandler.HandleLogin);

const port: number = 3000;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
