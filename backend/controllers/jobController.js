import mongoose from 'mongoose';
import { deleteAttachments } from './attachmentController.js';

// model
import Job from '../models/job.js';

const docFieldsToPopulate = [
    'customer',
    'createdBy',
    'drivers',
    'fees',
    'status',
    'notes.createdBy'
];

// get all jobs
const getJobs = async (req, res) => {
    let filter = {};

    // if there are parameters, set them as a filter and return the filtered jobs, otherwise return all jobs
    if (req.params) {
        const { model, id } = req.params;

        filter = { [model]: id };
    };

    const jobs = await Job.find(filter).populate(docFieldsToPopulate);

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
    const newJob = JSON.parse(req.body.job);
    const files = req.files;

    try {
        // for each note, check if it has an attachment property, if so get the matching file originalname with the attachment file name
        newJob.notes.forEach(note => {
            if (note.attachment) {
                const result = files.find(file => file.originalname === note.attachment.filename);
                const { contentType, filename, id, originalname, size } = result;

                note.attachment = { contentType, filename, originalname, size, files_id: id };
            };
        });

        // add doc to db
        let job = await Job.create({
            ...newJob,
            createdBy: user_id
        });

        // populate fields
        job = await job.populate(docFieldsToPopulate);

        return res.status(200).json(job);
    }
    catch (err) {
        console.error(err);

        console.error('An error has occured, job creation has been aborted, and uploaded files will be deleted.');
        // 'errors' contains any mongoose model-validation fails, rename to error
        const { errors: error } = err;

        // if there's any files that were uploaded, delete them now
        if (req.files.length > 0) deleteAttachments(req.files);

        // go through the properties and seek out note errors, format them in an array
        for (const key in error) {
            const propStringArr = key.split('.');
            const propName = propStringArr[0];

            // having an error with the first note's subject, mongoose will return an error object with a key named 'note.0.subject'
            // cycle through the props, and with note errors, format them into an array so it'll be error.notes[index] = {subject;}
            if (propName === 'notes') {
                const index = propStringArr[1];

                // note schema has subject or message properties
                const noteProp = propStringArr[2];

                // this is the actual error message
                const message = error[key].message;

                // create the array if it doesn't exist
                if (!error.notes) error.notes = [];

                error.notes[index] = {
                    ...error.notes[index],
                    [noteProp]: message
                };

                // delete the old key
                delete error[key];
            };
        };

        // if no input errors, then send back the err message as a server error
        if (!error) {
            error.server = err || err.message;
        };

        return res.status(400).json({ error });
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
    const updatedFields = { ...req.body };

    console.log(updatedFields);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    try {
        const job = await Job.findByIdAndUpdate(
            { _id: id },
            { ...updatedFields },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).populate(docFieldsToPopulate);

        if (!job) {
            return res.status(404).json({ error });
        };

        console.log('to client:', job.notes);

        return res.status(200).json(job);
    }
    catch (err) {
        console.error(err);

        // 'errors' contains any mongoose model-validation fails, rename to error
        const { errors: error } = err;

        // go through the properties and seek out note errors, format them in an array
        for (const key in error) {
            const propStringArr = key.split('.');
            const propName = propStringArr[0];

            // having an error with the first note's subject, mongoose will return an error object with a key named 'note.0.subject'
            // cycle through the props, and with note errors, format them into an array so it'll be error.notes[index] = {subject;}
            if (propName === 'notes') {
                const index = propStringArr[1];

                // note schema has subject or message properties
                const noteProp = propStringArr[2];

                // this is the actual error message
                const message = error[key].message;

                // create the array if it doesn't exist
                if (!error.notes) error.notes = [];

                error.notes[index] = {
                    ...error.notes[index],
                    [noteProp]: message
                };

                // delete the old key
                delete error[key];
            };
        };

        // if no input errors, then send back the err message as a server error
        if (!error) {
            error.server = err.message;
        };

        return res.status(400).json({ error });
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