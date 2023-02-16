import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const statusSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            match: [/^[A-Za-z0-9 ]*$/, 'Only letters, numbers, and spaces.'],
            required: [true, 'Cannot be empty.']
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Cannot be empty.']
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        isDefault: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

statusSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

export default Model('Status', statusSchema);