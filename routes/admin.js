const { Router } = require("express");
const { adminModel } = require("../db.js")
const adminRouter = Router()
const bcrypt = require("bcrypt")
const zod = require("zod");
const { adminAuth } = require("../auth.js")
const jwt = require("jsonwebtoken")

require("dotenv").config()
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
adminRouter.post("/signup", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  //input validation has to be donee
  const hashedPassword = await bcrypt.hash(password, 5);
  try {
    await adminModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    })
    res.json({
      "message": "Admin Created Successfully"
    })
  }
  catch (err) {
    console.log(err);
    res.json({
      "message": "admin creation failed"
    })
  }
})

adminRouter.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  //input validation has to be donee
  let result;
  try {
    result = await adminModel.findOne({
      email: email
    })
  } catch (err) {
    console.log(err);
    res.json({
      "message": "database couldn't execute findone"
    })
    return;
  }
  if (result) {
    const hashedPassword = result.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordMatch) {
      const token = jwt.sign({
        id: result._id
      }, ADMIN_JWT_SECRET);
      res.json({
        "message": "authentication successful",
        "token": token,
      })
    }
    else {
      console.log("invalid password");
      res.json({
        "message": "Incorrect Password"
      })
    }
  }
  else {
    res.json({
      "message": "invalid email"
    })
  }


})
adminRouter.post("/createcourse", adminAuth, async function (req, res) {

})
adminRouter.put("/course", adminAuth, async function (req, res) {

})
adminRouter.get("/course/bulk", adminAuth, async function (req, res) {

})
module.exports = {
  adminRouter: adminRouter
}
