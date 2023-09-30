import express from "express";
import crud from "../controllers/CRUD.js";
import validations from "../middlewares/ValidationSchema.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();

router.route('/')
    .get(crud.getItems)
    .post(verifyToken,validations.createNewItemSchema(), crud.createItem);
router.route('/:id')
    .get(validations.checkItemID,crud.getItem)
    .patch(verifyToken,validations.checkItemID,validations.updateItemSchema(),crud.updateItem)
    .delete(verifyToken,validations.checkItemID,crud.deleteItem);

export default router