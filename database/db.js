const dotenv = require("dotenv");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
dotenv.config({ path: "./config.env" });
const DATABASE = process.env.DATABASE;
const MONGODB_URL =DATABASE

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
  })
  .then(() => {
    console.log("good ho gaya");
    ///
  })
  .catch((e) => console.log(e));
