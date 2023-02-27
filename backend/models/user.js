import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new Schema({

    username: {
        type: String,
        unique: true,
        required: [true, 'Cannot be empty.'],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    //Our password is hashed with bcrypt
    password: {
        type: String,
        trim: true,
        required: [true, 'Cannot be empty.']
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Cannot be empty.'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    firstName: String,
    lastName: String,
    avatar: String,
    address: String,
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, json) {
            delete json.password
        }
    }
}
);

userSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

// static signup method
userSchema.statics.signup = async function (username, email, password) {
    // validation
    // if (!username || !email || !password) throw Error('All fields must be filled');
    if (!validator.isEmail(email)) throw Error('Email is not valid');
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

    const userQuery = await this.findOne({ username });
    const emailQuery = await this.findOne({ email });

    // throw error if any queries have results
    if (userQuery) throw { username: 'Username already in use' };
    if (emailQuery) throw Error('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        username,
        email,
        password: hash
    });

    return user;
};

// static login method

userSchema.statics.login = async function (email, password) {
    const errInputMsg = 'Cannot be empty.'
    const errMsg = 'Incorrect credentials.';
    const errors = {}

    if (!email) {
        errors.email = { message: errInputMsg };
    };

    if (!password) {
        errors.password = { message: errInputMsg };
    };

    // all fields are required, send error if any missing
    if (Object.keys(errors).length > 0) throw { errors };

    // getting either field wrong sends the same error to both fields to avoid alerting the user if an email exists on the database
    errors.email = { message: errMsg };
    errors.password = { message: errMsg };

    const user = await this.findOne({ email });

    if (!user) throw { errors };

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw { errors };

    return user;
};

const User = Model('User', userSchema);

export default User;