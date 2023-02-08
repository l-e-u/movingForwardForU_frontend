import { Schema, model as Model } from 'mongoose';

const transportSchema = new Schema({
    address: {
        type: String,
        trim: true,
        require: true
    },
    name: String,
    date: Date,
    attn: String,
    instructions: String,
    uploads: String
});

const logSchema = new Schema(
    {
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
        pickup: transportSchema,
        delivery: transportSchema,
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
            ref: 'Contact',
            require: true
        },
        parcelDimensions: {
            weight: String,
            length: String,
            width: String,
            height: String,
        },
        logs: [logSchema],
    },
    { timestamps: true }
);

export default Model('Job', jobSchema);;