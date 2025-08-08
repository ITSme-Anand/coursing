const { Router } = require("express")
const userRouter = Router();
const { userAuth } = require("./../auth.js")
const { userModel, purchaseModel, courseModel } = require("../db.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
userRouter.post("/signup", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  //input validation has to be donee
  const hashedPassword = await bcrypt.hash(password, 5);
  try {
    await userModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    })
    res.json({
      "message": "user Created Successfully"
    })
  }
  catch (err) {
    console.log(err);
    res.json({
      "message": "user creation failed"
    })
  }

})

userRouter.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  //input validation has to be donee
  let result;
  try {
    result = await userModel.findOne({
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
      }, USER_JWT_SECRET);
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
})

userRouter.get("/courses", userAuth, async function (req, res) {
  const userId = req.id;
  let result;
  try {
    result = await purchaseModel.find({
      userId: userId,
    })
  }
  catch (err) {
    console.error(err);
    res.json({
      "message": "couldn't get user's purchases",
      "error": err
    })
    return;
  }
  let courses = [];
  try {
    result.forEach(async function (purchase) {
      let courseId = purchase.courseId;
      let course = await courseModel.findOne({
        _id: courseId,
      })
      courses.push(course);
    });
  }
  catch (err) {
    console.error(err);
    res.json({
      "message": "couldn't get my courses",
      "error": err,
    })
    return;
  }
  res.json({
    "message": "acquired my courses",
    "courses": courses,
  })
})
module.exports = {
  userRouter: userRouter
}


