import express = require("express");
import bodyParser = require("body-parser");

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

const port: number = 3000;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));
