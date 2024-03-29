var express = require("express");
var app = express();
var dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
var PORT = process.env.PORT;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
////////////
require("./database/db");
var cors = require("cors");

app.use(cors());
//---------------------
console.log("khansaab");
var provideside = require("./router/provideside");
app.use(provideside);
var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, function () {
  console.log("server is runing ".concat(PORT));
});
