import mongoose from 'mongoose';
import Job from '../models/job.js'

// get all jobs
const getJobs = async (req, res) => {
    const jobs = await Job.find({});

    return res.status(200).json(jobs);
}

// get a single job
const getJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such job.' });
    };

    const job = await Job.findById(id);

    if (!job) {
        return res.status(404).json({ error: 'No such job.' });
    };

    res.status(200).json(job);
};

// create new job
const createJob = async (req, res) => {
    const { status, pickUp, dropOff, contacts, carriers } = req.body;

    // add doc to db
    try {
        const job = await Job.create({
            status,
            pickUp,
            dropOff,
        });
        res.status(200).json(job);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// delete a workout
const deleteJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such job.' });
    };

    const job = await Job.findByIdAndDelete({ _id: id });

    if (!job) {
        return res.status(404).json({ error: 'No such job.' });
    };

    res.status(200).json(job);
};

// update a workout
const updateJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such job.' });
    };

    const job = await Job.findByIdAndUpdate(
        { _id: id },
        { ...req.body }
    );

    if (!job) {
        return res.status(404).json({ error: 'No such job.' });
    };

    res.status(200).json(job);
};

export { createJob, getJob, getJobs, deleteJob, updateJob };