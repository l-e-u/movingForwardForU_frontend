import { Schema, model as Model } from 'mongoose';

const archiveSchema = new Schema({
    amendments: String,
    createdBy: String,
    createdOn: Date,
    reference: String,
    parcel: String,
    organization: String,
    mileage: Number,
    billing: [{
        baseAmount: Number,
        finalAmount: Number,
        feeName: String,
    }],
    delivery: {
        address: String,
        date: Date,
        includeTime: Boolean,
    },
    drivers: [{
        fullName: String,
        email: String,
    }],
    pickup: {
        address: String,
        date: Date,
        includeTime: Boolean,
    },
    notes: [{
        attachments: Array,
        createdBy: String,
        createdOn: Date,
        message: String,
        subject: String,
    }]
},
    { timestamps: true }
);

export default Model('Archive', archiveSchema);