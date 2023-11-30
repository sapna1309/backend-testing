const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  profession: String,
  city: String,
  diet: String,
  smoke: String,
  drink: String,
  createFor: String,
  maritalStatus: String,
  height: String,
  country: String,
  religion: String,
  motherTongue: String,
  mobile: Number,
  numberCode: String,
  address: String,
  day: Number,
  month: String,
  year: Number,
  age: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  follow: { type: Boolean, default: false },
});

const UserData = mongoose.model('User', userSchema);

module.exports = UserData;
