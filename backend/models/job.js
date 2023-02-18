import { Schema, model as Model } from 'mongoose';

const transportSchema = new Schema({
    address: {
        type: String,
        trim: true,
        required: [true, 'Cannot be empty.']
    },
    date: Date,
});

const logSchema = new Schema(
    {
        note: {
            type: String,
            trim: true,
            required: [true, 'Cannot be empty.']
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

const jobSchema = new Schema(
    {
        pickup: transportSchema,
        delivery: transportSchema,
        parcel: {
            type: String,
            trim: true,
            set: i => !i ? null : i
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reference: {
            type: String,
            trim: true,
            set: i => !i ? null : i
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status',
            require: [true, 'Make a selection.']
        },
        drivers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
            required: [true, 'Make a selection.']
        },
        logs: [logSchema],
    },
    { timestamps: true }
);

export default Model('Job', jobSchema);;