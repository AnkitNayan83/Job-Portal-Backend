import JWT from "jsonwebtoken";
import Application from "../models/applicationModel.js";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer"))
    return next("You are not authorized");

  const token = authHeader.split(" ")[1];

  try {
    const payload = JWT.verify(token, process.env.JWT_KEY);
    req.user = { userId: payload.userId, isEmployer: payload.isEmp };
    next();
  } catch (error) {
    next("Invalid token");
  }
};

export const verifyEmployer = async (req, res, next) => {
  userAuth(req, res, () => {
    if (req.user && req.user.isEmployer) return next();
    else return next("You are not authorized");
  });
};

export const checkApplied = async (req, res, next) => {
  const userId = req.user.userId;
  const jobId = req.params.jobId;
  const check = await Application.findOne({ $and: [{ userId }, { jobId }] });
  if (check) next("you have already applied");
  else next();
};

export default userAuth;
