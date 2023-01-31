import mongoose from "mongoose";
import Email from '../models/email.js';

// get all emails
const getEmails = async (req, res) => {
    const emails = await Email.find({});

    return res.status(200).json(emails);
}

// get a single email
const getEmail = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such email.' });
    };

    const email = await Email.findById(id);

    if (!email) {
        return res.status(404).json({ error: 'No such email.' });
    };

    res.status(200).json(email);
};

// create new email
const createEmail = async (req, res) => {
    const { address } = req.body;

    let emptyFields = [];

    // DEV NOTE: ADD VALIDATION FOR STATUS_ID AND SEND OUT ERROR IF INVALID
    if (!address) emptyFields.push('Email');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    };

    // add doc to db
    try {
        let email = await Email.create({
            ...req.body
        });

        res.status(200).json(email);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a workout
const deleteEmail = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such email.' });
    };

    const email = await Email.findByIdAndDelete({ _id: id });

    if (!email) {
        return res.status(404).json({ error: 'No such email.' });
    };

    res.status(200).json(email);
};

// update a workout
const updateEmail = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such email.' });
    };

    const email = await Email.findByIdAndUpdate(
        { _id: id },
        { ...req.body }
    );

    if (!email) {
        return res.status(404).json({ error: 'No such email.' });
    };

    res.status(200).json(email);
};

export { createEmail, getEmail, getEmails, deleteEmail, updateEmail };