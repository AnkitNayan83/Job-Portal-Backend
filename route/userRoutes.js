import express from "express";
import {
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
} from "../controller/userController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 *  @swagger
 *  tags:
 *    name: UserRoute
 *    description: user apis
 */

//UPDATE User
/**
 * @swagger
 * /api/v1/user/update-user:
 *    put:
 *      summary: update new user
 *      security:
 *        bearerAuth: []
 *      tags: [UserRoute]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: user updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal serevr error
 */
router.put("/update-user", userAuth, updateUser);

// Get User('s)
router.get("/all", getAllUser);
router.get("/:id", getUser);

// Delete User
router.delete("/delete-user", userAuth, deleteUser);

export default router;
