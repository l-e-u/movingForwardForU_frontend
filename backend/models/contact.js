import { Schema } from 'mongoose';

const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const validatePhone = function (string) {
    let isPhoneNumber = /\d{9}/;
    let phoneNum = string.replace(/\D/g, '');

    return isPhoneNumber.test(phoneNum);
}

const contactSchema = Schema({
    organization: String,
    firstName: String,
    lastName: String,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zipcode: Number,
    email: String,
    phone: Number
});

export default contactSchema;