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
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // require: true
        },
        isDefault: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

statusSchema.plugin(uniqueValidator, { message: 'is already in use.' });

export default Model('Status', statusSchema);