import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Please enter your first name"]
    },
    last_name: {
        type: String,
        required: [true, "Please enter your last name"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [(email)=>{
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
        }, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('User', userSchema);