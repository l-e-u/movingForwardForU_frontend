import { Schema, model as Model } from 'mongoose';

const logSchema = new Schema(
    {
        note: String,
        upload: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const parcelSchema = new Schema({
    customerReference: String,
    weight: String,
    length: String,
    width: String,
    height: String,
});

const fromToSchema = new Schema({
    dateTime: Date,
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    attn: String,
})

const jobSchema = new Schema(
    {
        status_id: {
            type: Schema.Types.ObjectId,
            ref: 'Status'
        },
        drivers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        customer_id: {
            type: Schema.Types.ObjectId,
            ref: 'Contact'
        },
        parcel: parcelSchema,
        log: [logSchema],
        from: fromToSchema,
        to: fromToSchema,
    },
    {
        // when sending job doc to the client, change status_id object to status
        toJSON: {
            transform: function (doc, json) {
                json.status = json.status_id;
                delete json.status_id;
            }
        }
    },
    { timestamps: true }
);

const Job = Model('Job', jobSchema);

export default Job;