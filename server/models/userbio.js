const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
//schema user
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "name is needed"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email id is necessary"],
    },
    password: {
      type: String,
      required: [true, "password must be specified"],
    },
    designation: {
      type: String,
    },
    university: {
      type: String,
    },
    year: {
      type: String,
    },
    educatorStatus: {
      type: String,
      required : [true, "educatorStatus must be specified."]
    },
    qualification: {
      type: String,
    },
  },
  { strict: false },
);

// hash the password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//create mongodb model
const User = mongoose.model("user", userSchema);

module.exports = User;
