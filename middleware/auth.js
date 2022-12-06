const jwt = require("jsonwebtoken");
const Register = require("../model/providerregister");
const SECRET = "secret";
const auth = async (req, res, next) => {
  try {
    console.log("try");
    const token = req.cookies.jwt;
    console.log(` da token da ${token} `);
    const varifyuser = jwt.verify(token, SECRET);
    console.log(varifyuser);
    console.log("oshooo");

    const user = await Register.findOne({ _id: varifyuser._id });
    console.log("sai");
    // console.log(user.email)
    console.log(user.name);
    console.log("sai");
    console.log(user);

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.send("SESSION EXPIRE");
    res.send(error);
  }
};
module.exports = auth;
