import { Schema, model as Model } from 'mongoose';
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
        required: true
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

userSchema.statics.login = async function (username, password) {
    if (!username || !password) throw Error('All fields must be filled');

    const user = await this.findOne({ username });

    if (!user) throw Error('Incorrect username');

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw Error('Incorrect password');

    return user;
};

const User = Model('User', userSchema);

export default User;