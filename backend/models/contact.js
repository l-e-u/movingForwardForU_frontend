import { Schema, model as Model } from 'mongoose';

const contactSchema = Schema({
    organization: String,
    firstName: String,
    lastName: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zipcode: Number,
    phone: Number,
    email: String,
});

const Contact = Model('Contact', contactSchema);

export default Contact;