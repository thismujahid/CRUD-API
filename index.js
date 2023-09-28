import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
import express from "express";
import itemsRoutes from "./router/items.js";
import authRoutes from "./router/auth.js";
import mongoose from "mongoose"
import httpStatusText from "./utils/httpStatusText.js";
const url = process.env.DB_URL;
mongoose.connect(url);
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/items', itemsRoutes);
app.use('/api/auth', authRoutes);
app.all('*', (_, res) => {
    res.status(404).json({
        status: httpStatusText.ERROR,
        code: 404,
        message: "Requested URL is not found",
    })
})
app.use((err, _, res) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || httpStatusText.ERROR,
        code: err.statusCode || 500,
        message: err.message,
        data: err.data || null,

    })
})
app.listen(process.env.PORT || 3000, () => { });
