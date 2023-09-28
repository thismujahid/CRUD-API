import express from "express";
import crud from "../controllers/CRUD.js";
import validations from "../middlewares/ValidationSchema.js";
const router = express.Router();

router.route('/')
    .get(crud.getItems)
    .post(validations.createNewItemSchema(), crud.createItem);
router.route('/:id')
    .get(validations.checkItemID,crud.getItem)
    .patch(validations.checkItemID,validations.updateItemSchema(),crud.updateItem)
    .delete(validations.checkItemID,crud.deleteItem);

export default router