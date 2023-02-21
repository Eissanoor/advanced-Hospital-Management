const express = require("express");
const router = new express.Router();
//317149
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const multer = require("multer");
const auth = require("../middleware/auth");
const addJob = require("../model/addjob");
const CreateProfile = require("../model/createprofile");
const providerRegister = require("../model/providerregister");
const otp = require("../model/otp");
const emailvarify = require("../model/emailotp");
const { profile } = require("console");

require("../database/db");
router.use(cookieparser());
router.use(bodyparser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: false }));
router.use(bodyparser.json());
router.use(express.json());
const storage = multer.diskStorage({
  destination: "./public/upload",
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000000000000000 },
});
router.use("/profile", express.static("public/upload"));

router.post("/upload", upload.single("profile"), (req, res) => {
  console.log(req.file);
  res.json({
    success: 1,
    profile_url: `https://humstaffing.herokuapp.com/profile/${req.file.filename}`,
  });
});

var jwttoken = async (req, res, next) => {
  var token = req.headers.autherization;
  console.log(token);

  token = token.split(" ")[1];
  const varifyuser = jwt.verify(
    token,
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  );
  console.log(varifyuser);
  const user = await providerRegister.findOne({ _id: varifyuser._id });
  console.log(user);

  req.token = token;
  req.user = user;

  next();
};

router.post("/signUp", async (req, res) => {
  let qdate = new Date();
  let date = qdate.toDateString();
  let Id = Math.floor(Math.random() * 100000) + 1;
  let email = req.body.email;
  let fullname = req.body.fullname;
  let password = req.body.password;
  console.log(` this is cookie ${req.cookies.jwt}`);
  const mail = await providerRegister.findOne({ email: email });
  console.log(mail);
  if (mail) {
    res.status(404).json({ error: "email already present" });
  }

  try {
    const registerEmp = new providerRegister({
      Id: Id,
      fullname: req.body.fullname,
      password: req.body.password,
      cpassword: req.body.cpassword,
      email: req.body.email,
      date: date,
    });
    const token = await registerEmp.generateAuthToken();
    res.cookie("jwt", token, { httpOnly: true });
    const random = Math.floor(Math.random() * 10000) + 1;
    console.log(random);
    //
    const otpData = new emailvarify({
      email: req.body.email,
      code: random,
      expireIn: new Date().getTime() + 60 * 10000,
    });

    var transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eissaanoor@gmail.com",
        pass: "asqgbvuvawbtjnqz",
      },
    });

    var mailoption = {
      from: "eissaanoor@gmail.com",
      to: email,
      subject: "sending email using nodejs",
      text: `Varify Email OTP ${random}`,
    };
    transpoter.sendMail(mailoption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email send " + info.response);
      }
    });

    const varifyemail = await otpData.save();
    console.log("saved sho");

    const registered = await registerEmp.save();
    console.log(registered);
    res.status(201).json(registerEmp);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/emailVrifyOtp", async (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const mail = await emailvarify.findOne({ code: code, email: email });
  if (mail) {
    const currentTime = new Date().getTime();
    const Diff = mail.expireIn - currentTime;
    console.log(Diff);
    if (Diff < 0) {
      res.status(401).send("otp expire with in 10 mints");
    } else {
      const mailVarify = await providerRegister.findOne({ email: email });

      console.log("email varification successful");
      res.status(201).send("email varification successful");
    }
  } else {
    res.status(400).send("Invalid Otp");
  }
});

router.post("/Login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await providerRegister.findOne({ email: email });
    console.log(useremail);
    const ismatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    // res.cookie("jwt", token, { httpOnly: true });
    if (!useremail || !password) {
      res.status(400).json({ masseg: "Enter Correct email or password" });
    } else if (ismatch) {
      res.status(200).json(useremail);
    } else {
      res.status(404).json({ masseg: "password are not matching" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ masseg: "invalid email" });
  }
});

router.post("/passwordchangeotpSend", async (req, res) => {
  const email = req.body.email;
  const mail = await providerRegister.findOne({ email: email });

  if (mail) {
    const random = Math.floor(Math.random() * 10000) + 1;
    console.log(random);
    try {
      const otpData = new otp({
        email: req.body.email,
        code: random,
        expireIn: new Date().getTime() + 300 * 1000,
      });

      var transpoter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "eissaanoor@gmail.com",
          pass: "asqgbvuvawbtjnqz",
        },
      });

      var mailoption = {
        from: "eissaanoor@gmail.com",
        to: email,
        subject: "sending email using nodejs",
        text: `changePassword OTP ${random}`,
      };
      transpoter.sendMail(mailoption, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("email send " + info.response);
        }
      });

      const registered = await otpData.save();
      console.log(registered);
      res.status(201).send(registered);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    console.log("You are not registered email");
    res.status(201).send("You are not registered email");
  }
});

router.post("/changePassword", async (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const mail = await otp.findOne({ code: code, email: email });
  if (mail) {
    const currentTime = new Date().getTime();
    const Diff = mail.expireIn - currentTime;
    console.log(Diff);
    if (Diff < 0) {
      res.status(401).send("otp expire with in 5 sec");
    } else {
      const mailVarify = await providerRegister.findOne({ email: email });
      const password = req.body.password;
      const ismatch = await bcrypt.compare(password, mailVarify.password);
      console.log(ismatch);
      mailVarify.password = password;

      const registered = await mailVarify.save();
      console.log("password change successful");
      res.status(201).send("password change successful");
    }
  } else {
    res.status(400).send("Invalid Otp");
  }
});
//upload.array("profile", 12),
//upload.single("profile"),
const cpUpload = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);
router.post("/CreateProfile", cpUpload, async (req, res) => {
  try {
    let Id = Math.floor(Math.random() * 100000) + 1;
    const {
      firstname,
      lastname,
      category,
      gender,
      Location,
      hourlypricestart,
      hourlypriceend,
      experience,
      aboutme,
      qalification,
      certification,
      speciality,
      fburl,
      instaurl,
      linkedinurl,
      twitterurl,
    } = req.body;

    const registerEmp = new CreateProfile({
      Id: Id,

      profile: `https://humstaffing.herokuapp.com/profile/${req.files.profile[0].filename}`,
      resume: `https://humstaffing.herokuapp.com/profile/${req.files.resume[0].filename}`,
      firstname: firstname,
      lastname: lastname,
      category: category,
      gender: gender,
      experience: experience,
      aboutme: aboutme,
      Location: Location,
      hourlypricestart: hourlypricestart,
      hourlypriceend: hourlypriceend,
      qalification: qalification,
      certification: certification,
      speciality: speciality,
      fburl: fburl,
      instaurl: instaurl,
      linkedinurl: linkedinurl,
      twitterurl: twitterurl,
    });
    var a = req.files;
    console.log(a.profile[0].filename);
    const registered = await registerEmp.save();
    console.log(registered);
    res.status(201).json(registerEmp);
  } catch (err) {
    console.log(err);
  }
});
router.get("/CreateProfile/:id", async (req, res) => {
  const _id = req.params.id;
  const getmens = await CreateProfile.findById(_id);
  res.status(201).send(getmens);
});
router.patch("/BasicInfo/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const getmens = await CreateProfile.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    console.log("khansaab");
    res.status(201).send(getmens);
    console.log(getmens);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post("/addJob", async (req, res) => {
  try {
    let qdate = new Date();
    let date =
      qdate.getDay() + "/" + qdate.getMonth() + "/" + qdate.getFullYear();
    const {
      positionTitle,
      hospital_Faculty,
      speciality,
      jod_duration,
      hourlyRate,
      shift,
      from,
      to,
      startDate,
      endDate,
      description,
    } = req.body;
    const totalhours = to - from;

    const addjob = new addJob({
      Date: date,
      positionTitle: positionTitle,
      hospital_Faculty: hospital_Faculty,
      speciality: speciality,
      jod_duration: jod_duration,
      hourlyRate: hourlyRate,
      shift: shift,
      from: from,
      to: to,
      totalhours: totalhours,
      startDate: startDate,
      endDate: endDate,
      description: description,
    });
    const registered = await addjob.save();
    res.status(201).send(registered);
  } catch (err) {
    console.log("error");

    console.log(err);
  }
});

router.get("/", jwttoken, async (req, res) => {
  const getorder = req.user;
  res.json(getorder);
  // console.log(` this is cookie ${req.cookies.jwt}`);
});

router.get("/secret", jwttoken, (req, res) => {
  res.send("secret da der");
});
router.get("/logout", jwttoken, async (req, res) => {
  try {
    res.send("logoutshow");
  } catch (e) {
    console.log(e);
  }
});
router.get("/email", async (req, res) => {});
module.exports = router;
