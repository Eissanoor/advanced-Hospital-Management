const mongoose = require("mongoose");
const validator = require("validator");
const geocoder = require("../utils/geocoder");
const empoleeSchema = new mongoose.Schema({
  //
  Id: String,
  fburl: String,
  instaurl: String,
  linkedinurl: String,
  twitterurl: String,
  hourlypricestart: String,
  hourlypriceend: String,
  profile: String,
  resume: String,
  firstname: String,
  lastname: String,
  category: String,
  gender: String,
  Location: {
    type: String,
    required: [true, "Please add an address"],
  },
  addresss: {
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
  const loc = await geocoder.geocode(this.Location);
  console.log(loc);
  this.addresss = {
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
