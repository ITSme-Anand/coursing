const { Router } = require("express")
const { userAuth } = require("../auth.js")
const courseRouter = Router();
const { purchaseModel, courseModel } = require("../db.js")
courseRouter.post("/purchase", userAuth, async function (req, res) {

  const userId = req.userId;
  const courseId = req.body.courseId;
  try {
    const result = await purchaseModel.create({
      userId: userId,
      courseId: courseId,
    })
  }
  catch (err) {
    console.error(err);
    res.json({
      "message": "Purchase failed",
      "error": err,
    })
    return;
  }
  res.json({
    "message": "Course Purchased",
  })
})
// this function doesn't need a middleware 
courseRouter.get("/preview", async function (req, res) {
  try {
    const result = await courseModel.find({});
    res.json({
      "courses": result
    })
  } catch (err) {
    console.log(err);
    res.json({
      "message": "error previewing courses",
      "error": err,
    })
  }
})

module.exports = {
  courseRouter: courseRouter
}

