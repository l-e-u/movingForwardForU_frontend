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
    firstName: String,
    middleName: String,
    lastName: String,
    note: String,
    address: String,
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address.'],
    },
    phone: {
        type: String,
        trim: true,
        validate: [validatePhone, 'Please fill a valid phone number.']
    }
});

export default contactSchema;