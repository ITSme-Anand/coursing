const { Router } = require("express");

const adminRouter = Router()

adminRouter.post("/signup", async function (req, res) {

})

adminRouter.post("/signin", async function (req, res) {

})
adminRouter.post("/createcourse", async function (req, res) {

})
adminRouter.put("/course", async function (req, res) {

})
adminRouter.post("/course/bulk", async function (req, res) {

})
module.exports = {
  adminRouter: adminRouter
}
