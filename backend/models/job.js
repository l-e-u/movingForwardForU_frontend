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
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
            required: [true, 'Make a selection.']
        },
        drivers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        parcel: {
            type: String,
            trim: true,
            set: i => !i ? null : i
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
    },
    { timestamps: true }
);

export default Model('Job', jobSchema);;