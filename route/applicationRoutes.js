import express from "express";
import userAuth, { checkApplied } from "../middlewares/authMiddleware.js";
import {
  createApplication,
  deleteApplication,
  getMyApplications,
} from "../controller/applicationController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Application:
 *      type: object
 *      required:
 *        - userId
 *        - jobId
 *        - resume
 *        - status
 *      properties:
 *        id:
 *          type: string
 *          description: The auto generated id for application collection
 *        userId:
 *          type: string
 *          description: ID of the applied user
 *        resume:
 *          type: string
 *          description: user's resume
 *        status:
 *          type: string
 *          description: status of application
 *      example:
 *        id: SDDF456QW1223
 *        userId: QWER4569DFG
 *        resume: "upload/xyz123"
 *        status: "applied"
 *        jobId: skfgo98123sf
 */

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
