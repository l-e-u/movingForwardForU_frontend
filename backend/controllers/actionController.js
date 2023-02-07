import mongoose from 'mongoose';
import Action from '../models/action.js'

// get all actions
const getActions = async (req, res) => {
    const actions = await Action.find({});

    return res.status(200).json(actions);
};

// get a action
const getAction = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such action.' });
    };

    const action = await Action.findById(id);

    if (!action) {
        return res.status(404).json({ error: 'No such action.' });
    };

    res.status(200).json(action);
};

// create a new action
const createAction = async (req, res) => {
    const { name, description } = req.body;

    // add doc to db
    try {
        if ([name, description].some(input => input.trim() === '')) throw { message: 'Cannot be empty.' };

        const action = await Action.create({
            name,
            description,
        });
        res.status(200).json(action);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a action
const deleteAction = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such action.' });
    };

    const action = await Action.findByIdAndDelete({ _id: id });

    if (!action) {
        return res.status(404).json({ error: 'No such action.' });
    };

    res.status(200).json(action);
};

// update a action
const updateAction = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such action.' });
    };

    const action = await Action.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: 'after' }
    );

    if (!action) {
        return res.status(404).json({ error: 'No such action.' });
    };

    res.status(200).json(action);
};

export { createAction, getAction, getActions, deleteAction, updateAction };