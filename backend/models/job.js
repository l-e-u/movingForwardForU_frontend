import { Schema, model as Model } from 'mongoose';

const jobSchema = new Schema({
    status: String,
    package: String,
});

const Job = Model('Job', jobSchema);

export default Job;