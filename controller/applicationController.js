import Application from "../models/applicationModel.js";
import fs from "fs";
import jobsModel from "../models/jobsModel.js";

export const createApplication = async (req, res, next) => {
  const userId = req.user.userId;
  const jobId = req.params.jobId;

  const application = new Application({ userId, jobId });
  // if (req.file) application.resume = req.file.path;
  // else return next("you need to upload your resume in PDF format");
  const savedApp = await application.save();
  res.status(201).json({
    message: "Your application was submitted",
    success: true,
    savedApp,
  });
};

export const deleteApplication = async (req, res, next) => {
  const userId = req.user.userId;
  const applicationId = req.params.id;
  const application = await Application.findOne({ _id: applicationId });
  if (!application) return next("no application exist with this id");

  if (application.userId.toString() !== userId)
    return next("You are not authorized");

  const resumePath = application.resume;

  fs.unlink(resumePath, (err) => {
    if (err) {
      console.log(err);
      return next("something went wrong");
    }
    console.log("file deleted");
  });

  await Application.deleteOne({ _id: applicationId });

  res
    .status(200)
    .json({ success: true, message: "application deleted successfully" });
};

export const getMyApplications = async (req, res, next) => {
  const { sort } = req.params;
  const queryObject = { userId: req.user.userId };
  let queryResult = Application.find(queryObject);

  if (sort === "latest") queryResult = queryResult.sort("-createdAt");
  if (sort === "oldest") queryResult = queryResult.sort("createdAt");

  const application = await queryResult;

  res.status(200).json({
    success: true,
    Total_applications: queryResult.length,
    application,
  });
};
