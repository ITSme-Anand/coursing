const express = require("express")
const { userRouter } = require("./routes/user.js")
const { courseRouter } = require("./routes/course.js")
const { adminRouter } = require("./routes/admin.js")
const app = express()


app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use('/admin', adminRouter);

app.listen(3000, () => {
  console.log("server is running in port 3000")
})
