import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new Schema({

    password: String,
    avatar: String,
    address: String,
    firstName: {
        type: String,
        trim: true,
        required: [true, 'Cannot be empty.']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Cannot be empty.']
    },
    note: {
        type: String,
        trim: true,
        set: i => !i ? null : i
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    //Our password is hashed with bcrypt
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Cannot be empty.'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
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

    if (!user.isVerified) {
        errors.email.message = 'Not verified.';
        throw { errors };
    };

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw { errors };

    return user;
};

userSchema.statics.verify = async function ({ _id, password, confirmPassword }) {
    const u = await this.findById(_id);

    if (u.isVerified) {
        throw {
            errors: {
                token: { message: 'You have already been verified, please login.' }
            }
        }
    };

    if (password !== confirmPassword) {
        throw {
            errors: {
                password: { message: 'Passwords do not match.' },
                confirmPassword: { message: 'Passwords do not match.' }
            }
        };
    };

    if (!validator.isStrongPassword(password)) {
        throw {
            errors: {
                password: { message: 'Password is not strong enough.' }
            }
        };
    };

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.findByIdAndUpdate(
        { _id },
        {
            password: hash,
            isVerified: true
        },
        { returnDocument: 'after' }
    );

    return user;
}

const User = Model('User', userSchema);

export default User;