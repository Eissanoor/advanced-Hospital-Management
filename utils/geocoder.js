const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "te501vHxdBYJHLDvNPCnFEX7srocBUDF",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
