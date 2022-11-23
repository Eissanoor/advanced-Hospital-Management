const mongoose = require("mongoose");
const validator = require("validator");
const empoleeSchema = new mongoose.Schema({
  //

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
  profile: String,
  resume: String,
  firstname: String,
  lastname: String,
  category: String,
  gender: String,
  location: String,
  hourlyrange: String,
  experience: String,
  aboutme: String,
  qalification: String,
  certification: String,
  speciality: String,
});
/////colletion
const CreateProfile = new mongoose.model("CreateProfile", empoleeSchema);

module.exports = CreateProfile;
