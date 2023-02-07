import { Schema, model as Model } from 'mongoose';

const contactSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        note: String,
        address: String,
        billingAddress: String,
        organization: {
            type: String,
            require: true,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'is invalid'],
        },
        phone: {
            number: Number,
            ext: Number
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    },
    { timestamps: true }
);

export default Model('Contact', contactSchema);;