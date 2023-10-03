import express from "express";
import userController from "../controllers/users.controller.js";
import validations from "../middlewares/ValidationSchema.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();
// get all users

// register new users

// login to user account
router.route('/')
    .get(verifyToken, userController.getAllUsers)
router.route('/register')
    .post(validations.createNewUserSchema(), userController.register)

router.route('/login')
    .post(userController.login);
router.route('/profile')
    .get(verifyToken, userController.profile);
router.route('/logout')
    .post(userController.logout);
router.route('/delete/:id')
    .delete(validations.checkItemID, verifyToken, userController.deleteUser);

export default router