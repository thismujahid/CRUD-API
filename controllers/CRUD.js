import { validationResult } from "express-validator";
import Item from "../models/item.model.js";
import httpStatusText from "../utils/httpStatusText.js";
import wrapperErrorHandler from "../middlewares/AsyncWarpper.js";
import AppErrors from "../utils/AppErrors.js";
import { createReponseData } from "../utils/helpers.js";
const getItems = wrapperErrorHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit || 10);
  const page = parseInt(req.query.page || 1);
  const count = await Item.count();
  const items = await Item.find({}, { __v: false })
    .limit(limit)
    .skip((page - 1) * limit);
  res.json(
    createReponseData({
      code: 200,
      data: items,
      metadata: {
        page: page,
        limit: limit,
        total: count,
      },
    })
  );
});
const getItem = wrapperErrorHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id, { __v: false });
  if (!item) {
    const error = new AppErrors("Item not found", 404);
    return next(error);
  }
  res.json(
    createReponseData({
      code: 200,
      data: item,
    })
  );
});

const createItem = wrapperErrorHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppErrors(errors.array(), 400);
    return next(error);
  }
  const item = new Item(req.body);
  await item.save();
  res.status(201).json(
    createReponseData({
      code: 201,
      data: item,
    })
  );
});
const updateItem = wrapperErrorHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppErrors(errors.array(), 400);
    return next(error);
  }
  const ID = req.params.id;
  const updateRes = await Item.updateOne(
    { _id: ID },
    { $set: { ...req.body } }
  );
  if (updateRes.modifiedCount === 0) {
    const error = new AppErrors("Invalid data", 400);
    return next(error);
  }
  const updatedItem = await Item.findById(ID);
  if (!updatedItem) {
    const error = new AppErrors("Item not found", 404);
    return next(error);
  }
  res.status(200).json(
    createReponseData({
      code: 200,
      data: updatedItem,
    })
  );
});

const deleteItem = wrapperErrorHandler(async (req, res, next) => {
  const response = await Item.deleteOne({ _id: req.params.id });
  if (response && response.deletedCount) {
    res.status(200).json(
        createReponseData({
            code: 200,
            data: `Item with ID: ${req.params.id} deleted`,
        }));
  } else {
    const error = new AppErrors("Item not found", 404);
    next(error);
  }
});
export default {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
