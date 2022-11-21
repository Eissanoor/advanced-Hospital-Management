const dotenv = require("dotenv");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
dotenv.config({ path: "./config.env" });

const MONGODB_URL =
  "mongodb+srv://eissanoor:Eisa.123@cluster0.bpuor.mongodb.net/humstaffing?retryWrites=true&w=majority";

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
