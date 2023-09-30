import Jwt from "jsonwebtoken";
import AppErrors from "../utils/AppErrors.js";

export function verifyToken(req, res, next) {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
        const error = new AppErrors("No authorization token provided", 401)
        return next(error);
    }
    if (!authHeader.includes('Bearer')) {
        const error = new AppErrors("invalid token", 401)
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        const error = new AppErrors("invalid token", 401)
        return next(error);
    }
    try {
        Jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        const error = new AppErrors(`Unauthorized: ${err.message ? err.message.replace('jwt', 'token'):''}`, 401)
        return next(error);
    }
}