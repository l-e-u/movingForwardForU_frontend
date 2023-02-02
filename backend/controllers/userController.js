import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECURE, { expiresIn: '2d' });
};

// login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);

        // create a token
        const token = createToken(user._id);

        res.status(200).json({
            username,
            token,
            isAdmin: user.isAdmin
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(400).json({ error: error.message });
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

// using token on browser's local storage, verify token, return username and isAdmin permission
const getUserAuthorization = async (req, res) => {
    // verify authentication
    const { authentication } = req.headers;

    if (!authentication) {
        return res.status(401).json({ error: 'Access denied, login or signup' });
    };

    const token = authentication.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECURE);

        const user = await User.findOne({ _id }).select('_id isAdmin username');

        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request denied' });
    };
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

export { loginUser, signupUser, getUsers, getUser, createUser, deleteUser, updateUser, getUserAuthorization };