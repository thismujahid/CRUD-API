import { validationResult } from "express-validator";
import wrapperErrorHandler from "../middlewares/AsyncWarpper.js";
import User from "../models/user.model.js";
import { createReponseData, generateJWT } from "../utils/helpers.js";
import AppErrors from "../utils/AppErrors.js";
import { Password } from "../utils/PasswordCrpt.js";
import Jwt from 'jsonwebtoken';
const getAllUsers = wrapperErrorHandler(async (req, res) => {
    const limit = parseInt(req.query.limit || 10);
    const page = parseInt(req.query.page || 1);
    const count = await User.count()
    const users = await User.find({}, { "__v": false, 'password': false }).limit(limit).skip((page - 1) * limit)
    res.json(
        createReponseData({
            code: 200,
            data: users,
            metadata: {
                page: page,
                limit: limit,
                total: count
            }
        }));
});

const register = wrapperErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppErrors(errors.array(), 400);
        return next(error);
    }

    const { first_name, last_name, email, password } = req.body;
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        const error = new AppErrors("Email already exists", 400);
        return next(error);
    }
    const hashedPassword = await Password.hash(password);
    const newUser = new User({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword
    });
    newUser.token = await generateJWT({
        _id: newUser._id,
        email: newUser.email
    });
    const user = await newUser.save();
    delete user.password;
    res.status(201).json(
        createReponseData({
            code: 201,
            data: {
                user: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                },
                token: newUser.token
            }
        }));
})

const login = wrapperErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppErrors(errors.array(), 400);
        return next(error);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new AppErrors("Email is not registered", 400);
        return next(error);
    }

    const matchedPassword = await Password.compare(password, user.password);
    if (!matchedPassword) {
        const error = new AppErrors("Invalid password", 400);
        return next(error);
    }
    const token = await generateJWT({
        _id: user._id,
        email: user.email
    });
    await User.findByIdAndUpdate(user._id, { token: token });
    res.json(
        createReponseData({
            code: 200,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt
                },
                token: token
            },
        })
    )
});
const profile = wrapperErrorHandler(async (req, res, next) => {
    const decoded = Jwt.verify(req.access_token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
        const error = new AppErrors("No user found", 400);
        return next(error);
    }
    const token = await generateJWT({
        _id: user._id,
        email: user.email
    });
    await User.findByIdAndUpdate(user._id, { token: token });
    res.json(
        createReponseData({
            code: 200,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt
                },
                token: token
            },
        })
    )
});
const logout = (req, res) => {

    res.status(200).json(
        createReponseData({
            code: 200,
            data: {
                message: "Successfully logged out"
            }
        })
    )
}
 
const deleteUser = wrapperErrorHandler(async (req, res, next) => {
    const response = await User.deleteOne({ _id: req.params.id });
    if (response && response.deletedCount) {
        res.status(200).json(
            createReponseData({
                code: 200,
                data: `User with ID: ${req.params.id} deleted`,
            }));
    } else {
        const error = new AppErrors("User not found", 404);
        next(error);
    }
});
export default {
    getAllUsers,
    register,
    login,
    deleteUser,
    logout,
    profile
}