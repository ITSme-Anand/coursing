const { Router } = require("express");
const { adminModel, courseModel } = require("../db.js")
const adminRouter = Router()
const bcrypt = require("bcrypt")
const zod = require("zod");
const { adminAuth } = require("../auth.js")
const jwt = require("jsonwebtoken");
require("dotenv").config()
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

adminRouter.post("/signup", async function (req, res) {
  const { firstName, lastName, email, password } = req.body;
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
      "message": "user Created Successfully"
    })
  }
  catch (err) {
    console.log(err);
    res.json({
      "message": "user creation failed"
    })
  }
});

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

adminRouter.post("/course", adminAuth, async function (req, res) {
  const id = req.adminId;
  const { title, description, url, price } = req.body;
  let course
  try {
    course = await courseModel.create({
      title: title,
      url: url,
      description: description,
      price: price,
      creatorId: id,
    })
  } catch (err) {
    console.error(err);
    res.json({
      "message": "course creation failed"
    });
    return;
  }
  res.json({
    "message": "course created successfully",
    "courseId": course._id,
  })

})

adminRouter.put("/course", adminAuth, async function (req, res) {
  const { title, description, url, price, courseId } = req.body;
  try {
    await courseModel.updateOne({
      _id: courseId,
      adminId: req.id,
    }, {
      title: title,
      description: description,
      url: url,
      price: price,
    })
  } catch (err) {
    console.error(err);
    res.json({
      "message": "course updation failed",
      "error": err,
    });
    return;
  }
  res.json({
    "message": "course updated successfully",
    "courseId": courseId,
  })


})

adminRouter.get("/course/bulk", adminAuth, async function (req, res) {
  const adminId = req.adminId;
  let result;
  try {

    result = await courseModel.find({
      creatorId: adminId,
    })
    console.log("result obtained");
  } catch (err) {
    console.error(err);
    res.json({
      "message": "couldn't get courses",
      "err": err,
    })
    return;
  }
  courses = [];
  console.log(typeof result)
  await result.forEach(doc => courses.push(doc));
  res.json({
    "message": "courses obtained successfully",
    "courses": result,
  })
})

module.exports = {
  adminRouter: adminRouter
}
