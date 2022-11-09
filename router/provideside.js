const express = require("express");
const router = new express.Router();
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer")


const providerRegister=  require("../model/providerregister")
const otp = require("../model/otp")

require("../database/db")

router.use(bodyparser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: false }));
router.use(bodyparser.json())
router.use(express.json());


router.post("/providerRegister", async (req, res) => {
  let qdate = new Date();
  let date = qdate.toDateString();
  let Id = Math.floor(Math.random() * 100000);
  let email = req.body.email;
  let fullname = req.body.fullname;
  let password = req.body.password;
  let cpassword = req.body.cpassword;

  const mail = await providerRegister.findOne({ email: email });
console.log(mail);
  if (mail) {
    res.status(404).json({ error: "email already present" });
  }

  if (password === cpassword) {
    try {
      const registerEmp = new providerRegister({
        Id: Id,
        fullname: req.body.fullname,
        password: req.body.password,
        cpassword: req.body.cpassword,
        email: req.body.email,
        date: date,
      });
      
      const registered = await registerEmp.save();
      console.log(registered);
      res.status(201).send(registered);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(400).json({ massege: "Password are not macting" });
  }
});



router.post("/providerLogin",  async (req, res) =>
{
  

   try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await providerRegister.findOne({ email: email });
    console.log(useremail);
    if (!useremail || !password) {
      res.status(400).json("Enter Correct email or password");
    } else if (useremail.password === password) {
      res.status(201).json("Successful");
    } else {
      res.status(404).json("password are not matching");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("invalid email");
  }

})

router.post("/otpSend", async (req, res) =>
{
  const email = req.body.email;
  const mail = await providerRegister.findOne({ email: email });
  
  if (mail) {
    
    const random = Math.floor(Math.random() * 10000) + 1;
    console.log(random);
try {
  const otpData = new otp({

     email : req.body.email,
      code: random,
expireIn:new Date().getTime() + 60*1000
  })
  
  const registered = await otpData.save();
      console.log(registered);
  res.status(201).send(registered);
  


} catch (e) {
  res.status(400).send(e)
    }
    
    

  } else {
    
    console.log("You are not registered email");
  res.status(201).send("You are not registered email");

  }




})


router.post("/changePassword", async (req, res) =>
{
  const email = req.body.email;
  const code = req.body.code;
  const mail = await otp.findOne({ code: code, email: email });
  if (mail) {

    const currentTime = new Date().getTime();
    const Diff = mail.expireIn - currentTime;
console.log(Diff);
    if (Diff < 0) {
res.status(401).send("otp expire with in 5 sec")
    }
    else {
      const mailVarify = await providerRegister.findOne({ email: email });
      const cpassword = req.body.cpassword;
      const password = req.body.password;
      mailVarify.password = password;
      mailVarify.cpassword = cpassword;

      const registered = await mailVarify.save();
      console.log("password change successful");
      res.status(201).send("password change successful");



     

}


    
  }
  else {
    res.status(400).send("Invalid Otp");
  }







} )


router.post("/sendEmail", async (req, res) =>
{
  

 



})

router.get("/", (req, res) =>
{
  
  res.send("humstaffing")


})

module.exports = router;