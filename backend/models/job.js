import { Schema, model as Model } from 'mongoose';

const jobSchema = new Schema(
    {
        status: String,
        from: String,
        to: String,
        customer: String,
        note: String,
        parcel: String
    },
    { timestamps: true }
);

const Job = Model('Job', jobSchema);

export default Job;