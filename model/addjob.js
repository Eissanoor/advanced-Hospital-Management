const mongoose = require("mongoose");

const empoleeSchema = new mongoose.Schema({
  //
  positionTitle: String,
  hospital_Faculty: String,
  speciality: String,
  jod_duration: String,
  hourlyRate: Number,
  shift: String,
  from: Number,
  to: Number,
  startDate: String,
  endDate: String,
  description: String,
  Date: String,
  totalhours: Number,
});

//create geolocation

const AddJob = new mongoose.model("AddJob", empoleeSchema);

module.exports = AddJob;
