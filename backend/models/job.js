import { Schema, model as Model } from 'mongoose';

const transportSchema = new Schema({
    date: Date,
    address: {
        type: String,
        trim: true,
        index: true,
        required: [true, 'Cannot be empty.']
    },
    includeTime: {
        type: Boolean,
        default: false
    }
});

const noteSchema = new Schema(
    {
        createdAt: {
            type: Date,
            default: new Date(),
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            trim: true,
            index: true,
            required: [true, 'Cannot be empty.']
        },
        subject: {
            type: String,
            trim: true,
            index: true,
            required: [true, 'Cannot be empty.']
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
        delivery: transportSchema,
        notes: [noteSchema],
        pickup: transportSchema,
        createdBy: {
            ref: 'User',
            required: true,
            type: Schema.Types.ObjectId,
        },
        customer: {
            ref: 'Contact',
            required: [true, 'Make a selection.'],
            type: Schema.Types.ObjectId,
        },
        drivers: [{
            ref: 'User',
            type: Schema.Types.ObjectId,
        }],
        fees: [{
            ref: 'Fee',
            type: Schema.Types.ObjectId,
        }],
        parcel: {
            set: i => !i ? null : i,
            trim: true,
            type: String,
        },
        reference: {
            set: i => !i ? null : i,
            trim: true,
            type: String,
        },
        status: {
            ref: 'Status',
            required: [true, 'Make a selection.'],
            type: Schema.Types.ObjectId,
        },
    },
    { timestamps: true }
);

export default Model('Job', jobSchema);;