import { Schema, model as Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const pointSchema = new Schema({
    type: {
        type: String,
        enum: ['pointSchema'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const userSchema = new Schema({

    username: {
        type: String,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
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
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String,
        address: {
            street1: String,
            street2: String,
            city: String,
            state: String,
            country: String,
            zip: String,
            location: {
                type: pointSchema,
                required: false
            }
        }
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (username, email, password) {
    // validation
    if (!username || !email || !password) throw Error('All fields must be filled');
    if (!validator.isEmail(email)) throw Error('Email is not valid');
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

    const userQuery = await this.findOne({ username });
    const emailQuery = await this.findOne({ email });

    // throw error if any queries have results
    if (userQuery) throw Error('Username already in use');
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
    if (!addy || !password) throw Error('All fields must be filled');

    const user = await this.findOne({ email });
};

// userSchema.methods.comparePassword = function (plaintext, callback) {
//     return callback(null, bcrypt.compareSync(plaintext, this.password));
// };

const User = Model('User', userSchema);

export default User;