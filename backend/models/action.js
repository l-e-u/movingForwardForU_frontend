import { Schema, model as Model } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

// type of action for a stop (e.g. pickup, delivery, reroute)
const actionSchema = new Schema(
    {
        isDefault: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        description: {
            type: String,
            trim: true,
            require: true
        }
    },
    { timestamps: true }
);

actionSchema.plugin(uniqueValidator, { message: 'is already in use.' });

export default Model('Action', actionSchema);