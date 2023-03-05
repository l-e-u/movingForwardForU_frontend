import { Schema, model as Model } from 'mongoose';

const transportSchema = new Schema({
    date: Date,
    address: {
        type: String,
        trim: true,
        required: [true, 'Cannot be empty.']
    },
    includeTime: {
        type: Boolean,
        default: false
    }
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
        },
        createdAt: {
            type: Date,
            default: new Date(),
            required: true
        },
        updatedAt: {
            type: Date,
            default: new Date(),
            required: true
        }
    },
    { timestamps: false }
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
            required: [true, 'Make a selection.']
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