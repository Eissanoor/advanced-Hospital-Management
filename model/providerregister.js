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
empoleeSchema.methods.generateAuthToken = async function (data) {
  try {
    let params = {
      _id: this._id,
      email: this.email,
      password: this.password,
    };
    var token = jwt.sign(params, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (e) {
    console.log(e);
  }
};
empoleeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const providerRegister = new mongoose.model("SignUp", empoleeSchema);

module.exports = providerRegister;
