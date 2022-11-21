const mongoose = require("mongoose");
const dotenv = require("dotenv");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config({ path: "./config.env" });
const SECRET = "secret";
const empoleeSchema = new mongoose.Schema({
  //
  Id: {
    type: Number,
    unique: [true, "all ready exist Id"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid Email");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  password: String,

  date: String,

  fullname: String,
});
/////colletion
empoleeSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id.toString() }, SECRET); /////////////using env is secret. it is to same .env/file look //////////
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    //   {
    //     expiresIn:"2 seconds"
    //   });

    console.log(token);
  } catch (error) {
    console.log(error);
    console.log("the error part");
  }
};
empoleeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const providerRegister = new mongoose.model("providerSignUp", empoleeSchema);

module.exports = providerRegister;
