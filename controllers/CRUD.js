import { validationResult } from "express-validator";
import Item from "../models/items.js";
import httpStatusText from "../utils/httpStatusText.js";
import wrapperErrorHandler from "../middlewares/AsyncWarpper.js";
import AppErrors from "../utils/AppErrors.js";
const getItems = wrapperErrorHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit || 10);
    const page = parseInt(req.query.page || 1);
    const count = await Item.count()
    const items = await Item.find({}, { "__v": false }).limit(limit).skip((page - 1) * limit)
    res.json({
        statusCode: 200,
        status: httpStatusText.SUCCESS,
        data: items,
        metadata: {
            page: page,
            limit: limit,
            totalItems: count
        }
    });
});
const getItem = wrapperErrorHandler(async (req, res, next) => {

    const item = await Item.findById(req.params.id, { "__v": false });
    if (!item) {
        const error = new AppErrors("Item not found", 404)
        return next(error);
    }
    res.json({
        statusCode: 200,
        status: httpStatusText.SUCCESS,
        data: item,
    });
});

const createItem = wrapperErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppErrors(errors.array(), 400);
        return next(error);

    }
    const item = new Item(req.body);
    await item.save();
    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: item,
        statusCode: 201,
    });
})
const updateItem = wrapperErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppErrors(errors.array(), 400);
        return next(error);
    }
    const ID = req.params.id;
    const updateRes = await Item.updateOne({ _id: ID }, { $set: { ...req.body } })
    if (updateRes.modifiedCount === 0) {
        const error = new AppErrors("Invalid data", 400);
        return next(error)
    }
    const updatedItem = await Item.findById(ID);
    if (!updatedItem) {
        const error = new AppErrors("Item not found", 404);
        return next(error)
    }
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: updatedItem,
        statusCode: 200,
    });
})

const deleteItem = wrapperErrorHandler(async (req, res, next) => {
    const response = await Item.deleteOne({ _id: req.params.id })
    if (response && response.deletedCount) {
        res.status(200).json({
            message: `Item with ID: ${req.params.id} deleted`,
            status: httpStatusText.SUCCESS,
            data: null,
        });
    } else {
        const error = new AppErrors("Item not found", 404);
        next(error);
    }

})
export default {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
};
