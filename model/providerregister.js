const mongoose = require("mongoose");
const validator = require("validator");

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
  password: String,
  cpassword: String,
  date: String,

  fullname: String,
});
/////colletion
const providerRegister = new mongoose.model("providerRegister", empoleeSchema);

module.exports = providerRegister;
