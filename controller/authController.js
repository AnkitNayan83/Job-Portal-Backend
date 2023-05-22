import User from "../models/userModel.js";

export const register = async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!name) return next("name is required");

  if (!email) return next("email is required");

  if (!password) return next("password is required");

  const emailCheck = await User.findOne({ email });
  if (emailCheck) return next("This emai is already been used");

  //we will hash password at model(as it is more secure) by using mongoose middleware

  const user = new User(req.body);
  await user.save();

  const token = user.createJWT();

  res.status(201).json({
    success: true,
    message: "user registered",
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) return next("password is required");

  if (!email) return next("email is required");

  let user = await User.findOne({ email }).select("+password");

  if (!user) return next("wrong email id or password");

  const check = await user.comparePassword(password);

  if (!check) return next("wrong email id or password");

  const token = user.createJWT();

  user.password = undefined;

  user = { ...user._doc, token };

  res.status(200).json({
    message: "logged in successfully",
    success: true,
    token,
    user,
  });
};
