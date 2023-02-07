import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const vehicleSchema = new Schema(
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
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
    },
    { timestamps: true }
);

vehicleSchema.plugin(uniqueValidator, { message: 'is already in use.' });

export default Model('Vehicle', vehicleSchema);