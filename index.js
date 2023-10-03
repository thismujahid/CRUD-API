import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
import express from "express";
import itemsRoutes from "./router/items.route.js";
import usersRoutes from "./router/users.route.js";
import mongoose from "mongoose"
import httpStatusText from "./utils/httpStatusText.js";
import AppErrors from "./utils/AppErrors.js";
mongoose.connect(process.env.DB_URL).then(res => {
    console.log("Connected to DB")
})
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);
app.all('*', (req, res, next) => {
    const error = new AppErrors(`Requested URL is not found or the ${req.method} method is not allowed on this URL.`, 404);
    next(error);
})
app.use((err, _, res, _1) => {
    const reCode = typeof err.code != 'number' || err.code > 600 ? 500 : err.code
    const resStatus = err.statusText || httpStatusText.ERROR
    const msgType = err.message instanceof Array ? "array" : typeof err.message
    res.status(reCode).json({
        status: reCode === 500?"Internal server error":resStatus,
        statusCode: reCode,
        message: msgType === 'array' ? err.message.map(el => el.msg).join(', ') : err.message,
        messages: msgType === 'array' ? err.message.map(el => el.msg): [err.message],
        data: err.data,
    }).end()
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port: " + process.env.PORT || 3000);
});
