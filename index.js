import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
import express from "express";
import itemsRoutes from "./router/items.js";
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
app.all('*', (req, res,next) => {
    const error  = new AppErrors(`Requested URL is not found or the ${req.method} method is not allowed on this URL.`, 404);
    next(error);
})
app.use((err, _, res, _1) => {
    res.status(err.code || 500).json({
        status: err.statusText || httpStatusText.ERROR,
        code: err.code || 500,
        message: err.message,
        type_of_message: err.message instanceof Array ? "array" : typeof err.message,
        data: err.data || null,
    })
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port: " + process.env.PORT || 3000);
});
