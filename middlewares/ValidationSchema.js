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
        body("author")
            .notEmpty()
            .withMessage("Author name is rquired")
    ]
}
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
        body("author")
           .optional()
    ]
}
const checkItemID = (req, res, next) => {
    if (mongoose.isValidObjectId(req.params.id)) {
        next();
    } else {
        const error = new AppErrors(`Invalid item ID #${req.params.id}`, 400);
        return next(error);
    }
}
export default { createNewItemSchema, checkItemID,updateItemSchema }