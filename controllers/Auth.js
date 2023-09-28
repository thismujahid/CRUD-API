import wrapperErrorHandler from "../middlewares/AsyncWarpper";
import Auth from "../models/auth.js";


const getAllUsers = wrapperErrorHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit || 10);
    const page = parseInt(req.query.page || 1);
    const count = await Auth.count()
    Item.find({}, { "__v": false }).limit(limit).skip((page - 1) * limit)
        .then((Auth) => {
            res.json({
                statusCode: 200,
                status: httpStatusText.SUCCESS,
                data: Auth,
                metadata: {
                    page: page,
                    limit: limit,
                    totalUsers: count
                }
            });
        })
        .catch((err) => {
            next({
                statusCode: 500,
                message: err.message,
            });
        });
});

const register = ()=>{
    
}

const login = ()=>{
    
}

export default {
    getAllUsers,
    register,
    login,
}