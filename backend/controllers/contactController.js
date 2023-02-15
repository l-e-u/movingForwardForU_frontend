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
    // user added to req after status route authenticates the user
    const { _id: user_id } = req.user;
    const {
        organization,
        name,
        address,
        phoneNumber,
        phoneExt,
        email,
        note
    } = req.body;

    // add doc to db
    try {
        let contact = await Contact.create({
            organization,
            name,
            address,
            phoneNumber,
            phoneExt,
            email,
            note,
            createdBy: user_id
        });

        // populate field
        contact = await contact.populate('createdBy');

        return res.status(200).json(contact);
    }
    catch (error) {
        console.error(error.errors)
        return res.status(400).json({ error });
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