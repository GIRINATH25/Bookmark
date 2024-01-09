const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const user = require("../models/user");
const router = express.Router(); 
require("dotenv").config();


const env=process.env;


router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const Hasemail = await user.findOne({ email: email });

    if (Hasemail) {
      return res.json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 8);
    const store = await user.create({ email: email, password: hash });

    if (!store) {
      return res.json({ message: "registration failed" });
    }

    return res.json({ message: "registration successfull" });
  } catch (e) {
    console.log(e.message);
    return res.json({ message: "registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const Hasemail = await user.findOne({ email: email });

    if (!Hasemail) {
      return res.json({ message: "Email doesn't exist" });
    }
    const dbPassword = Hasemail.password;
    const match = await bcrypt.compare(password, dbPassword);

    if (!match) {
      return res.json({ message: "wrong password" });
    }

    const accessToken=createToken(Hasemail);

    res.cookie("accessToken", accessToken);
    return res.json({accessToken:accessToken, id: Hasemail._id,message: "login successfull"});
  } catch (e) {
    return res.json({ message: "Error during login" });
  }
});

const createToken = (user) => {
    const accessToken = jwt.sign({email:user.email,id:user.id},env.SECRET);
    return accessToken;
}

module.exports = router;
