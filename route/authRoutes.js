import express from "express";
import { login, register } from "../controller/authController.js";
import rateLimit from "express-rate-limit";

//to limit requests from a ip address
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - password
 *        - email
 *        - location
 *      properties:
 *        id:
 *          type: string
 *          description: The auto generated id for user collection
 *        name:
 *          type: string
 *          description: The name of user
 *        password:
 *          type: string
 *          description: user's password
 *        email:
 *          type: string
 *          description: user's email
 *        location:
 *          type: string
 *          description: user's location
 *        isEmployer:
 *          type: boolean
 *          description: whether user is a employer or not
 *      example:
 *        id: SDDF456QW1223
 *        name: "User"
 *        password: "xyz123"
 *        email: "xyz@mymail.com"
 *        isEmployer: false
 *        location: india
 */

/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: authentication apis
 */

//register
/**
 * @swagger
 * /api/v1/auth/register:
 *    post:
 *      summary: register new user
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        201:
 *          description: user created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal serevr error
 */
router.post("/register", limiter, register);

//login

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: login page
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: login successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: something went wrong
 */
router.post("/login", limiter, login);

export default router;
