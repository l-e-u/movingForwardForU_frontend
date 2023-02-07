import mongoose from 'mongoose';
import Stop from '../models/stop.js'

// get all stops
const getStops = async (req, res) => {
    const stops = await Stop.find({});

    return res.status(200).json(stops);
};

// get a stop
const getStop = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such stop.' });
    };

    const stop = await Stop.findById(id);

    if (!stop) {
        return res.status(404).json({ error: 'No such stop.' });
    };

    res.status(200).json(stop);
};

// create a new stop
const createStop = async (req, res) => {
    const { action, dateTime, address, description } = req.body;

    // add doc to db
    try {
        if ([action, address, description].some(input => input.trim() === '')) throw { message: 'Cannot be empty.' };

        const stop = await Stop.create({
            action,
            dateTime,
            address,
            description
        });
        res.status(200).json(stop);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a stop
const deleteStop = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such stop.' });
    };

    const stop = await Stop.findByIdAndDelete({ _id: id });

    if (!stop) {
        return res.status(404).json({ error: 'No such stop.' });
    };

    res.status(200).json(stop);
};

// update a stop
const updateStop = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such stop.' });
    };

    const stop = await Stop.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: 'after' }
    );

    if (!stop) {
        return res.status(404).json({ error: 'No such stop.' });
    };

    res.status(200).json(stop);
};

export { createStop, getStop, getStops, deleteStop, updateStop };