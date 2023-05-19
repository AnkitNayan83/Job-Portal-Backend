import express from "express";
import userAuth, { checkApplied } from "../middlewares/authMiddleware.js";
import {
  createApplication,
  deleteApplication,
  getMyApplications,
} from "../controller/applicationController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// create application
router.post(
  "/apply/:jobId",
  userAuth,
  checkApplied,
  upload.single("resume"),
  createApplication
);

// delete application
router.delete("/delete/:id", userAuth, deleteApplication);

// get Application
router.get("/all", userAuth, getMyApplications);

export default router;
