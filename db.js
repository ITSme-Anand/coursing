const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
})

const adminSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
})

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  url: String,
  creatorId: ObjectId,
})

const purchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
})

const userModel = new mongoose.model('users', userSchema);
const adminModel = new mongoose.model('admins', adminSchema);
const purchaseModel = new mongoose.model('purchases', purchaseSchema);
const courseModel = new mongoose.model('courses', courseSchema);

module.exports = {
  userModel: userModel,
  adminModel: adminModel,
  purchaseModel: purchaseModel,
  courseModel: courseModel,
}


