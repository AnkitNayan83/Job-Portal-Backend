import User from "../models/userModel.js";

export const updateUser = async (req, res, next) => {
  const { email, name, location } = req.body;
  if (!email || !name || !location) return next("No field can be left empty");

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.location = location;
  await user.save();

  const token = user.createJWT();

  res.status(200).json({
    message: "user updated successfully",
    success: true,
    user,
    token,
  });
};

export const getAllUser = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json(users);
};

export const getUser = async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });
  res.status(200).json(user);
};

export const deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete({ _id: req.user.userId });
  res.status(200).json({ message: "user deleted!!" });
};
