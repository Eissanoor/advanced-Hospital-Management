var express = require("express");
var app = express();
const path = require("path");
const hbs = require("hbs");
var dotenv = require("dotenv");
const passport = require("passport");
dotenv.config({ path: "./config.env" });
var PORT = process.env.PORT;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
////////////
// console.log(passport.initialize());
require("./database/db");
var cors = require("cors");
app.use(passport.initialize());
app.use(cors());
const templetpath = path.join(__dirname, "./views");
app.set("view engine", "hbs");
app.get("/logi", (req, res) => {
  res.render("login");
});
app.set("views", templetpath);
//---------------------
console.log("khansaab");
var provideside = require("./router/provideside");
app.use(provideside);
var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const { hasOnlyExpressionInitializer } = require("typescript");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, function () {
  console.log("server is runing ".concat(PORT));
});
