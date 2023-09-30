import { body } from "express-validator";
import mongoose from "mongoose";
import AppErrors from "../utils/AppErrors.js";

const createNewItemSchema = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 2 })
      .withMessage("name is too short"),
    body("price")
      .notEmpty()
      .withMessage("price is rquired")
      .isNumeric()
      .withMessage("price must be a number")
      .isLength({ min: 1, max: 10000 })
      .withMessage("price must be greater than 1 and less than 10,000"),
    body("author").notEmpty().withMessage("Author name is rquired"),
  ];
};
const updateItemSchema = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 2 })
      .withMessage("name is too short"),
    body("price")
      .optional()
      .isNumeric()
      .withMessage("price must be a number")
      .isLength({ min: 1, max: 10000 })
      .withMessage("price must be greater than 1 and less than 10,000"),
    body("author").optional(),
  ];
};

const createNewUserSchema = () => {
  return [
    body("first_name")
      .notEmpty()
      .withMessage("Please enter your first name")
      .isLength({ min: 2 })
      .withMessage("first name is too short"),
    body("last_name")
      .notEmpty()
      .withMessage("Please enter your last name")
      .isLength({ min: 2 })
      .withMessage("last name is too short"),
    body("email")
      .notEmpty()
      .withMessage("Please enter your E-mail")
      .isEmail()
      .withMessage("E-mail is invalid"),
    body("password")
      .notEmpty()
      .withMessage("Please enter your password")
      .isStrongPassword()
      .withMessage("password is not strong"),
  ];
};
const checkItemID = (req, res, next) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    next();
  } else {
    const error = new AppErrors(`Invalid item ID #${req.params.id}`, 400);
    return next(error);
  }
};
export default {
  createNewItemSchema,
  checkItemID,
  updateItemSchema,
  createNewUserSchema,
};
