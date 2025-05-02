const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'User Email is required'],
      lowercase: true,
      unique: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'User Password is required'],
      minlength: 6,
    },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);
module.exports = User;
// module.exports = mongoose.model('User, userSchema')
