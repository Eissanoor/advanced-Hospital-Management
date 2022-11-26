const mongoose = require("mongoose");
const validator = require("validator");
const geocoder = require("../utils/geocoder");
const empoleeSchema = new mongoose.Schema({
  //
  Id: String,

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
  city: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
  },
  hourlyrange: String,
  experience: String,
  aboutme: String,
  qalification: String,
  certification: String,
  speciality: String,
});

//create geolocation

empoleeSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.city);
  console.log(loc);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
  };

  // Do not save address
  this.address = undefined;
  next();
  console.log("1");
});
/////colletion
const CreateProfile = new mongoose.model("CreateProfile", empoleeSchema);

module.exports = CreateProfile;
