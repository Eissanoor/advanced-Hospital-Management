const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./database/db");
//---------------------

const provideside = require("./router/provideside");
app.use(provideside);

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`server is runing ${PORT}`);
});
