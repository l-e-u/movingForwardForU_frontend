import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const contactSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            set: i => !i ? null : i
        },
        note: {
            type: String,
            trim: true,
            set: i => !i ? null : i
        },
        address: {
            type: String,
            trim: true,
            required: [true, 'Cannot be empty.']
        },
        billingAddress: {
            type: String,
            trim: true,
            set: i => !i ? null : i
        },
        organization: {
            type: String,
            required: [true, 'Cannot be empty.'],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            set: i => !i ? null : i,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
        },
        phoneNumber: {
            type: String,
            trim: true,
            set: i => !i ? null : i.match(/\d/g).join(''),
            match: [/^\d{10}$/, 'Needs to have 9 digits.']
        },
        phoneExt: {
            type: String,
            trim: true,
            set: i => !i ? null : i.match(/\d/g).join(''),
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