import mongoose from 'mongoose';
import Job from '../models/job.js';

// get all jobs
const getJobs = async (req, res) => {
    // populate and rename status_id to status
    // populate and rename customer_id to customer
    // populate and rename log's user_id to user, but only return the username and _id of the user who created the log entry
    const jobs = await Job.find({}).populate([
        'status_id',
        'customer_id',
        { path: 'drivers', select: 'username' },
        { path: 'log.user_id', select: 'username' }
    ]);

    return res.status(200).json(jobs);
}

// get a single job
const getJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such job.' });
    };

    const job = await Job.findById(id).populate([
        'status_id',
        'customer_id',
        { path: 'drivers', select: 'username' },
        { path: 'log.user_id', select: 'username' }
    ]);

    if (!job) {
        return res.status(404).json({ error: 'No such job.' });
    };

    res.status(200).json(job);
};

// create new job
const createJob = async (req, res) => {
    const { status_id, customer_id, from, to } = req.body;
    const { _id: user_id } = req.user;

    let emptyFields = [];

    // DEV NOTE: ADD VALIDATION FOR STATUS_ID AND SEND OUT ERROR IF INVALID

    // if (!customer_id) emptyFields.push('Customer');
    // if (!status_id) emptyFields.push('Status');
    // if (!from.street1) emptyFields.push('From');
    // if (!to.street1) emptyFields.push('To');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    };

    // add doc to db
    try {
        let job = await Job.create({
            from,
            to,
            status_id,
            customer_id,
            log: {
                note: "Created",
                user_id
            }
        });


        // populate fields
        job = await job.populate([
            'status_id',
            'customer_id',
            { path: 'drivers', select: 'username' },
            { path: 'log.user_id', select: 'username' }
        ]);

        res.status(200).json(job);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    };
};

// delete a job
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

// update a job
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

// get all jobs that are assinged to the logged user
const getJobsByUserId = async (req, res) => {
    // jobs route authenticates user and stores _id in the response
    const { _id } = req.user;

    const jobs = await Job.find({ drivers: _id }).populate([
        'status_id',
        'customer_id',
        { path: 'drivers', select: 'username' },
        { path: 'log.user_id', select: 'username' }
    ]);
    res.status(200).json(jobs);


    // console.log('Will filter jobs with this user id:', _id);

    // res.status(404).json({ error: 'under development' });
};

export { createJob, getJob, getJobs, deleteJob, updateJob, getJobsByUserId };