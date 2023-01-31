import { Schema, model as Model } from 'mongoose';
import Email from './email.js';
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
        index: true
    },
    //Our password is hashed with bcrypt
    password: {
        type: String,
        required: true
    },
    email_id: {
        type: Schema.Types.ObjectId,
        ref: 'Email'
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
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, json) {
            json.email = json.email_id;

            delete json.email_id;
        }
    }
}
);

// static signup method
userSchema.statics.signup = async function (username, addy, password) {
    // validation
    if (!username || !addy || !password) throw Error('All fields must be filled');
    if (!validator.isEmail(addy)) throw Error('Email is not valid');
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough');

    const userQuery = await this.findOne({ username });
    const emailQuery = await Email.findOne({ address: addy });

    // throw error if any queries have results
    if (userQuery) throw Error('Username already in use');
    if (emailQuery) throw Error('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const email = await Email.create({ address: addy });
    const user = await this.create({
        username,
        email_id: email._id,
        password: hash
    });

    return user;
};

// userSchema.methods.comparePassword = function (plaintext, callback) {
//     return callback(null, bcrypt.compareSync(plaintext, this.password));
// };

const User = Model('User', userSchema);

export default User;