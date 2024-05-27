const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  token: String 
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    config.get("jwtPrivateKey")
  );

  this.token = token;
  return token;
};

userSchema.statics.findByToken = function(token) {
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    return this.findOne({ _id: decoded._id });
  } catch (ex) {
    return null;
  }
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
