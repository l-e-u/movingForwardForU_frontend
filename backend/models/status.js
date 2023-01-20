import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const statusSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            require: true,
        },
        description: {
            type: String,
            trim: true,
            require: true,
        }
    },
    { timestamps: true }
);

statusSchema.plugin(uniqueValidator, { message: 'is already in use.' });

const Status = Model('Status', statusSchema);

export default Status;