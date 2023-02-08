import mongoose from "mongoose";
import Contact from '../models/contact.js';

// get all contacts
const getContacts = async (req, res) => {
    const contacts = await Contact.find({}).populate('createdBy');

    return res.status(200).json(contacts);
}

// get a single contact
const getContact = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such contact.' });
    };

    const contact = await Contact.findById(id).populate('createdBy');

    if (!contact) {
        return res.status(404).json({ error: 'No such contact.' });
    };

    res.status(200).json(contact);
};

// create new contact
const createContact = async (req, res) => {
    const {
        organization,
        firstName,
        lastName,
        address,
        phone,
        email,
    } = req.body;

    let emptyFields = [];

    // DEV NOTE: ADD VALIDATION FOR STATUS_ID AND SEND OUT ERROR IF INVALID
    if (!organization) emptyFields.push('Organization');
    if (!address) emptyFields.push('Street1');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    };

    // add doc to db
    try {
        let contact = await Contact.create({
            ...req.body
        });

        // populate field
        contact = await contact.populate('createdBy');

        res.status(200).json(contact);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a workout
const deleteContact = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such contact.' });
    };

    const contact = await Contact.findByIdAndDelete({ _id: id });

    if (!contact) {
        return res.status(404).json({ error: 'No such contact.' });
    };

    res.status(200).json(contact);
};

// update a workout
const updateContact = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such contact.' });
    };

    const contact = await Contact.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: 'after' }
    ).populate('createdBy');


    if (!contact) {
        return res.status(404).json({ error: 'No such contact.' });
    };

    res.status(200).json(contact);
};

export { createContact, getContact, getContacts, deleteContact, updateContact };