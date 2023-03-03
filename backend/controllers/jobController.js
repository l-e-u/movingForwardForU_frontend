import mongoose from 'mongoose';
import Job from '../models/job.js';

const docFieldsToPopulate = [
    'status',
    'customer',
    'drivers',
    'createdBy',
    'logs.createdBy'
];

// get all jobs
const getJobs = async (req, res) => {
    let jobs = await Job.find({}).populate(docFieldsToPopulate);

    return res.status(200).json(jobs);
}

// get a single job
const getJob = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such job.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const job = await Job.findById(id).populate(docFieldsToPopulate);

    if (!job) {
        return res.status(404).json({ error });
    };

    res.status(200).json(job);
};

// create new job
const createJob = async (req, res) => {
    const { _id: user_id } = req.user;
    const {
        status,
        customer,
        reference,
        parcel,
        pickup,
        delivery,
        drivers,
        logs
    } = req.body;

    // add doc to db
    try {
        let job = await Job.create({
            status,
            customer,
            reference,
            parcel,
            pickup,
            delivery,
            drivers,
            logs,
            createdBy: user_id
        });

        // populate fields
        job = await job.populate(docFieldsToPopulate);

        return res.status(200).json(job);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const { errors } = err;

        // if no input errors, then send back the err message as a server error
        if (!errors) {
            err.errors.server = err.message;
        };

        return res.status(400).json({ error: err.errors });
    };
};

// delete a job
const deleteJob = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such job.' } };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const job = await Job.findByIdAndDelete({ _id: id });

    if (!job) {
        return res.status(404).json({ error });
    };

    res.status(200).json(job);
};

// update a job
const updateJob = async (req, res) => {
    const { id } = req.params;
    const error = { server: { message: 'No such job.' } };

    console.log({ ...req.body })

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    try {
        const job = await Job.findByIdAndUpdate(
            { _id: id },
            { ...req.body },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate(docFieldsToPopulate);

        if (!job) {
            return res.status(404).json({ error });
        };

        return res.status(200).json(job);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails
        const { errors } = err;

        // if no input errors, then send back the err message as a server error
        if (!errors) {
            err.errors.server = err.message;
        };

        return res.status(400).json({ error: err.errors });
    }
};

// get all jobs that are assinged to the logged user
const getJobsByUserId = async (req, res) => {
    // jobs route authenticates user and stores _id in the response
    const { _id } = req.user;

    const jobs = await Job.find({ drivers: _id }).populate(docFieldsToPopulate);
    res.status(200).json(jobs);
};

export { createJob, getJob, getJobs, deleteJob, updateJob, getJobsByUserId };