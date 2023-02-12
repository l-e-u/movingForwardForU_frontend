import mongoose from 'mongoose';
import Status from '../models/status.js'

// get all statuses
const getStatuses = async (req, res) => {
    const statuses = await Status.find({}).populate('createdBy');

    return res.status(200).json(statuses);
};

// get a status
const getStatus = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such status.' });
    };

    const status = await Status.findById(id).populate('createdBy');

    if (!status) {
        return res.status(404).json({ error: 'No such status.' });
    };

    res.status(200).json(status);
};

// create a new status
const createStatus = async (req, res) => {
    // user added to req after status route authenticates the user
    const { _id: user_id } = req.user;
    const { name, description, isDefault } = req.body;

    // add doc to db
    try {
        let status = await Status.create({
            isDefault,
            name,
            description,
            createdBy: user_id
        });

        // populate field
        status = await status.populate('createdBy');

        res.status(200).json(status);
    }
    catch (error) {
        res.status(400).json({ error });
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
        return res.status(404).json({ message: 'No such status.' });
    };

    try {
        const status = await Status.findByIdAndUpdate(
            { _id: id },
            { ...req.body },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate('createdBy');

        if (!status) {
            return res.status(404).json({ message: 'No such status.' });
        };

        res.status(200).json(status);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error });
    };
};

export { createStatus, getStatus, getStatuses, deleteStatus, updateStatus };