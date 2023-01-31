import { Schema, model as Model } from "mongoose";

const emailSchema = new Schema({
    address: {
        type: String, lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    // Change the default to true if you don't need to validate a new user's email address
    validated: {
        type: Boolean,
        default: false
    }
});

const Email = Model('Email', emailSchema);

export default Email;