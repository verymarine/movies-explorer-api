const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Maryna",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: (valid) => validator.isEmail(valid),
    // },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);