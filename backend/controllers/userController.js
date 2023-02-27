import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECURE, { expiresIn: '2d' });
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
        const token = createToken(user._id);

        return res.status(200).json({ user, token });
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const { errors } = err;

        // if no input errors, then send back the err message as a server error
        if (!errors) {
            err.errors.server = err.message;
        };

        return res.status(400).json({ error: err.errors });
    };
};

// signup user
const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.signup(username, email, password);

        // create a token
        const token = createToken(user._id);

        res.status(200).json({
            username,
            token,
            isAdmin: user.isAdmin
        });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ error });
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

// create a new user
const createUser = async (req, res) => {
    const { username, password, email } = req.body;

    // add user doc to db
    try {
        const user = await User.create({
            username,
            password,
            email,
        });

        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message })
    };
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
        { returnDocument: 'after' }
    );

    if (!user) {
        return res.status(404).json({ error: 'No such user.' });
    };

    res.status(200).json(user);
};

export { loginUser, signupUser, getUsers, getUser, createUser, deleteUser, updateUser };