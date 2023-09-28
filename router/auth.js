import express from "express";
import usersController from "../controllers/Auth.js";
import validations from "../middlewares/ValidationSchema.js";
const router = express.Router();

router.route('/users').get(usersController.getAllUsers);

export default router