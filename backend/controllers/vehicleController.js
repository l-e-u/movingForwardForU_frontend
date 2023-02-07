import mongoose from 'mongoose';
import Vehicle from '../models/vehicle.js'

// get all vehicles
const getVehicles = async (req, res) => {
    const vehicles = await Vehicle.find({}).populate('createdBy');

    return res.status(200).json(vehicles);
};

// get a vehicle
const getVehicle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such vehicle.' });
    };

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
        return res.status(404).json({ error: 'No such vehicle.' });
    };

    res.status(200).json(vehicle);
};

// create a new vehicle
const createVehicle = async (req, res) => {
    const { name, description } = req.body;

    // add doc to db
    try {
        if ([name, description].some(input => input.trim() === '')) throw { message: 'Cannot be empty.' };

        const vehicle = await Vehicle.create({
            name,
            description,
        });
        res.status(200).json(vehicle);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a vehicle
const deleteVehicle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such vehicle.' });
    };

    const vehicle = await Vehicle.findByIdAndDelete({ _id: id });

    if (!vehicle) {
        return res.status(404).json({ error: 'No such vehicle.' });
    };

    res.status(200).json(vehicle);
};

// update a vehicle
const updateVehicle = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such vehicle.' });
    };

    const vehicle = await Vehicle.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { returnDocument: 'after' }
    );

    if (!vehicle) {
        return res.status(404).json({ error: 'No such vehicle.' });
    };

    res.status(200).json(vehicle);
};

export { createVehicle, getVehicle, getVehicles, deleteVehicle, updateVehicle };