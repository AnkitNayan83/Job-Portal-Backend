import express from "express";
import userAuth, { verifyEmployer } from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJob,
  getJobStats,
  updateJob,
} from "../controller/jobController.js";

const router = express.Router();

// Create job
router.post("/create", verifyEmployer, createJob);

// update job
router.put("/update-job/:id", verifyEmployer, updateJob);

// delete job
router.delete("/delete-job/:id", verifyEmployer, deleteJob);

// get job stats
router.get("/job-stats", userAuth, getJobStats);

//get job(s)
router.get("/all", getAllJobs);
router.get("/:id", getJob);

export default router;
