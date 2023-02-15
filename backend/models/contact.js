import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const contactSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        note: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            required: [true, 'Cannot be empty.']
        },
        billingAddress: String,
        organization: {
            type: String,
            required: [true, 'Cannot be empty.'],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
        },
        phoneNumber: {
            type: Number,
            match: [/^\d{9}$/, 'Needs to have 9 digits.']
        },
        phoneExt: {
            type: Number,
            match: [/^[0-9]+$/, 'Numbers only.']
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    },
    { timestamps: true }
);

contactSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

export default Model('Contact', contactSchema);;