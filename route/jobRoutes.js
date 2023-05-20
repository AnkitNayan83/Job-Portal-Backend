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

/**
 * @swagger
 * components:
 *  schemas:
 *    Job:
 *      type: object
 *      required:
 *        - company
 *        - position
 *        - desc
 *      properties:
 *        id:
 *          type: string
 *          description: The auto generated id for job collection
 *        company:
 *          type: string
 *          description: The name of the company
 *        position:
 *          type: string
 *          description: position for which you are hiring
 *        status:
 *          type: string
 *          description: open/close
 *        worklocation:
 *          type: string
 *          description: job location
 *        workType:
 *          type: string
 *          description: type of work("full-time", "part-time", "internship")
 *        desc:
 *          type: string
 *          description: about the job
 *        employer:
 *          type: string
 *          description: user id of the person who is hiring
 *      example:
 *        id: SDDF456QW1223
 *        company: "companyName"
 *        position: "xyz dev"
 *        status: "open"
 *        workType: "full-time"
 *        worklocation: india
 *        desc: "xyz abc 123 456"
 *        employer: QWE2455987123
 */

/**
 *  @swagger
 *  tags:
 *    name: Job
 *    description: Job apis
 */

// Create job
/**
 * @swagger
 * /api/v1/job/create:
 *    post:
 *      summary: create new job
 *      tags: [Job]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *      responses:
 *        201:
 *          description: job created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Job'
 *        500:
 *          description: internal serevr error
 */
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
