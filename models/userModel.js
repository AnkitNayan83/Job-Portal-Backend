import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
      minlength: [6, "length of password should be greater than 6"],
      select: true,
    },
    email: {
      type: String,
      required: [true, "email cannot be empty"],
      unique: true,
      validate: validator.isEmail, //to validate email entered by user
    },
    location: {
      type: String,
      default: "India",
    },
    isEmployer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JSON Token
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, isEmp: this.isEmployer },
    process.env.JWT_KEY,
    {
      expiresIn: "3d",
    }
  );
};

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = bcrypt.compare(userPassword, this.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
