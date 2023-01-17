import { Schema, model as Model } from 'mongoose';

const jobSchema = new Schema(
    {
        status: String,
        pickUp: String,
        dropOff: String,
        contacts: {
            type: Array,
            default: [],
        },
        carriers: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true }
);

const Job = Model('Job', jobSchema);

export default Job;