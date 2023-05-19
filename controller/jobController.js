import Job from "../models/jobsModel.js";
import Application from "../models/applicationModel.js";
import mongoose from "mongoose";
import moment from "moment/moment.js";

export const createJob = async (req, res, next) => {
  const { company, position, desc } = req.body;

  if (!company) return next("company name is required");
  if (!position) return next("position is required");
  if (!desc) return next("description is required");

  const job = { ...req.body, employer: req.user.userId };
  const newJob = new Job(job);
  await newJob.save();

  res.status(201).json(newJob);
};

export const updateJob = async (req, res, next) => {
  const id = req.params.id;
  const updateJob = await Job.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json({ success: true, message: "job updated successfullly", updateJob });
};

export const deleteJob = async (req, res, next) => {
  const id = req.params.id;
  const job = await Job.findById(id);
  if (!job) return next(`no job with this id: ${id} exists`);
  try {
    await Application.deleteMany({ jobId: job._id });
  } catch (error) {
    next("something went wrong");
  }
  await Job.deleteOne({ _id: job._id });

  res.status(200).json({ success: true, message: "job deleted successfully" });
};

// aggregation pipeline for filtering
export const getAllJobs = async (req, res, next) => {
  const { company, workType, workLocation, status, mine, search, sort } =
    req.query;
  const queryObject = {};
  if (mine && req.user) {
    queryObject.employer = req.user.id;
  }
  if (company && company != "all") {
    queryObject.company = company;
  }
  if (status && status != "all") {
    queryObject.status = status;
  }
  if (workType && workType != "all") {
    queryObject.workType = workType;
  }
  if (workLocation && workLocation != "all") {
    queryObject.workLocation = workLocation;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = Job.find(queryObject);

  // sorting

  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);

  // jobs count
  const totalJobs = await Job.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);
  const jobs = await queryResult; //using await here as sort and skip will only work when we are fetching data not after that

  res.status(200).json({
    success: true,
    jobs,
    totalJobs,
    numOfPage,
  });
};

export const getJob = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  res.status(200).json(job);
};

export const getJobStats = async (req, res, next) => {
  const stats = await Job.aggregate([
    // searching jobs created by user
    {
      $match: {
        employer: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const defaultStats = stats.map((item) => {
    const { _id, count } = item;
    const obj = {};
    obj[_id] = count;
    return obj;
  });

  let monthlyStats = await Job.aggregate([
    {
      $match: {
        employer: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthlyStats = monthlyStats
    .map((item) => {
      const {
        _id: { month, year },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  let totalJobs = 0;
  if (stats.length > 0) {
    totalJobs = stats.reduce(
      (accumulate, currentItem) => accumulate + currentItem.count,
      0
    );
  }

  res.status(200).json({
    success: true,
    totalJobs,
    monthlyStats,
    defaultStats,
  });
};
