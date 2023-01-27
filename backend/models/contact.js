import { Schema, model as Model } from 'mongoose';

const contactSchema = new Schema(
    {
        organization: String,
        firstName: String,
        lastName: String,
        street1: String,
        street2: String,
        city: String,
        state: String,
        zipcode: String,
        phone: Number,
        email: String,
        note: String,
    },
    { timestamps: true }
);

const Contact = Model('Contact', contactSchema);

export default Contact;