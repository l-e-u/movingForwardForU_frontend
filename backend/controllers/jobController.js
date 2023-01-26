import mongoose from 'mongoose';
import Job from '../models/job.js';

// get all jobs
const getJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('status_id');

    return res.status(200).json(jobs);
}

// get a single job
const getJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such job.' });
    };

    const job = await Job.findById(id).populate('status');

    if (!job) {
        return res.status(404).json({ error: 'No such job.' });
    };

    res.status(200).json(job);
};

// create new job
const createJob = async (req, res) => {
    const { status_id, from, to } = req.body;

    let emptyFields = [];

    // DEV NOTE: ADD VALIDATION FOR STATUS_ID AND SEND OUT ERROR IF INVALID

    if (!status_id) emptyFields.push('Status');
    if (!from) emptyFields.push('From');
    if (!to) emptyFields.push('To');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    };

    // add doc to db
    try {
        let job = await Job.create({
            from,
            to,
            status_id: selectedStatus._id,
        });

        // populate status field to return name, description, and _id
        job = await job.populate('status_id');

        res.status(200).json(job);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

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