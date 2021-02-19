const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  email: String,
  name: String,
  profilePicture: String,
  credits: {
    type: Number,
    default: 0,
  },
});

mongoose.model("users", userSchema);
