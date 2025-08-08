const express = require("express")
const { userRouter } = require("./routes/user.js")
const { courseRouter } = require("./routes/course.js")
const { adminRouter } = require("./routes/admin.js")
const { mongoose } = require("mongoose")
require("dotenv").config()
const app = express()
app.use(express.json())
const PORT = process.env.PORT;
const DB_URL = process.env.mongoURL;


app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use('/admin', adminRouter);


async function main() {
  console.log("about to connect to the database");
  await mongoose.connect(DB_URL)
  console.log("database connected");
  app.listen(PORT, () => {
    console.log("server is running in port 3000")
  })
}

main()
