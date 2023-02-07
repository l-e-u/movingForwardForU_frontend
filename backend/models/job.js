import { Schema, model as Model } from 'mongoose';

const logSchema = new Schema(
    {
        upload: String,
        note: {
            type: String,
            trim: true,
            require: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    },
    { timestamps: true }
);

const jobSchema = new Schema(
    {
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reference: {
            type: String,
            trim: true,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status',
            require: true
        },
        drivers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Contact'
        },
        parcelDimensions: {
            weight: String,
            length: String,
            width: String,
            height: String,
        },
        logs: [logSchema],
        stops: [{
            type: Schema.Types.ObjectId,
            ref: 'Stop',
        }]
    },
    { timestamps: true }
);

export default Model('Job', jobSchema);;