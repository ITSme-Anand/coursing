require("dotenv").config()
const jwt = require("jsonwebtoken")
const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
async function userAuth(req, res, next) {
  const token = req.headers.token;
  try {
    const decodedData = await jwt.verify(token, USER_JWT_SECRET);
  } catch (err) {
    console.log(err);
    res.json({
      "message": "Token verification failed"
    });
    return;
  }
  if (decodedData.id) {
    console.log("authenticated User");
    req.userId = id;
    next();
  }
  else {
    console.log("invalid user");
    res.json({
      "message": "invalid user"
    })
  }
}
async function adminAuth(req, res, next) {
  const token = req.headers.token;
  try {
    const decodedData = await jwt.verify(token, ADMIN_JWT_SECRET);
  } catch (err) {
    console.log(err);
    res.json({
      "message": "Token verification failed"
    });
    return;
  }
  if (decodedData.id) {
    console.log("authenticated Admin");
    req.adminId = id;
    next();
  }
  else {
    console.log("invalid Admin");
    res.json({
      "message": "invalid Admin"
    })
  }
}
module.exports = {
  adminAuth: adminAuth,
  userAuth: userAuth,
}
