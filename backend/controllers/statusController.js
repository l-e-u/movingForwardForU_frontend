import mongoose from 'mongoose';
import Status from '../models/status.js'

// get all statuses
const getStatuses = async (req, res) => {
    const statuses = await Status.find({});

    return res.status(200).json(statuses);
};

// get a status
const getStatus = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such status.' });
    };

    const status = await Status.findById(id);

    if (!status) {
        return res.status(404).json({ error: 'No such status.' });
    };

    res.status(200).json(status);
};

// create a new status
const createStatus = async (req, res) => {
    const { name, description } = req.body;

    // add doc to db
    try {
        if ([name, description].some(input => input.trim() === '')) throw { message: 'Cannot be empty.' };

        const status = await Status.create({
            name,
            description,
        });
        res.status(200).json(status);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a status
const deleteStatus = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such status.' });
    };

    const status = await Status.findByIdAndDelete({ _id: id });

    if (!status) {
        return res.status(404).json({ error: 'No such status.' });
    };

    res.status(200).json(status);
};

// update a status
const updateStatus = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such status.' });
    };

    const status = await Status.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: 'after' }
    );

    if (!status) {
        return res.status(404).json({ error: 'No such status.' });
    };

    res.status(200).json(status);
};

export { createStatus, getStatus, getStatuses, deleteStatus, updateStatus };