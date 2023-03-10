import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

// services
import { sendVerifyEmailRequest } from '../services/email.js';

const loginToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECURE, { expiresIn: '2d' });
};

const registerToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.EMAIL_TOKEN_SECURE,
        { expiresIn: '1h' }
    );
};

// when the homepage refeshes, it checks browser's localStorage for a tocken
// once the token is verified, user is granted access.
// else, no token or malformed token, redirects to login
const loginUser = async (req, res) => {
    const error = { server: { message: 'Request denied.' } };

    // verify authentication if a token is present
    const { authentication } = req.headers;

    if (authentication) {
        const token = authentication.split(' ')[1];

        try {
            const { _id } = jwt.verify(token, process.env.SECURE);

            const user = await User.findOne({ _id });

            // user model will remove password when sending json
            return res.status(200).json(user);
        }
        catch (err) {
            console.log(err);

            return res.status(401).json({ error });
        };
    };

    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create a token
        const token = loginToken(user._id);

        return res.status(200).json({ user, token });
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const { errors } = err;

        // if no input errors, then send back the err message as a server error
        if (!errors) {
            err.errors = {
                server: { message: err.message }
            };
        };

        return res.status(400).json({ error: err.errors });
    };
};

const verifyEmailToken = async (req, res) => {
    const { emailToken } = req.params;

    try {
        const { userId: _id } = jwt.verify(emailToken, process.env.EMAIL_TOKEN_SECURE);

        const user = await User.findById(_id);

        return res.status(200).json(user);
    }
    catch (err) {
        console.error(err);

        // error for tokens over their 1h expiration
        if (err.name === 'TokenExpiredError') {
            err.errors = {
                token:
                    { message: 'Email token has expired.' }
            };
        };

        // 'errors' contains any mongoose model-validation fails, rename to error
        const { errors: error } = err;

        // if no input errors, then send back the err message as a server error
        if (!error) {
            err.error = {
                server: { message: err.message }
            };
        };

        return res.status(400).json({ error });
    };


}

// set user.isVerified to true and set their password
const verifyUser = async (req, res) => {
    const { _id, password, confirmPassword } = req.body;

    try {
        const user = await User.changePassword({ _id, password, confirmPassword });

        user.isVerified = true;

        await user.save();

        return res.status(200).json(user);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const { errors } = err;

        // if no input errors, then send back the err message as a server error
        if (!errors) {
            err.errors = {
                server: { message: err.message }
            };
        };

        return res.status(400).json({ error: err.errors });
    };
};

// create a new user
const registerUser = async (req, res) => {
    const { email, firstName } = req.body;

    try {
        const user = await User.create({
            ...req.body
        });

        const token = registerToken(user._id);

        await sendVerifyEmailRequest({ firstName, email, token });

        return res.status(200).json(user);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const { errors } = err;

        // if no input errors, then send back the err message as a server error
        if (!errors) {
            err.errors = {
                server: { message: err.message }
            };
        };

        return res.status(400).json({ error: err.errors });
    };
};

// get all users
const getUsers = async (req, res) => {
    const users = await User.find({});

    return res.status(200).json(users);
};

// get a user
const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such user.' });
    };

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ error: 'No such user.' });
    };

    res.status(200).json(user);
};

// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such user.' });
    };

    const user = await User.findByIdAndDelete({ _id: id });

    if (!user) {
        return res.status(404).json({ error: 'No such user.' });
    };

    return res.status(200).json(user);
};

// update a user
const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such user.' });
    };

    const user = await User.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if (!user) {
        return res.status(404).json({ error: 'No such user.' });
    };

    res.status(200).json(user);
};

export {
    deleteUser,
    getUser,
    getUsers,
    loginUser,
    registerUser,
    updateUser,
    verifyUser,
    verifyEmailToken
};