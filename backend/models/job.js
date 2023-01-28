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
    reference: String,
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
        timestamps: true,

        // when sending json to client rename properties of id references
        toJSON: {
            transform: function (doc, json) {
                json.status = json.status_id;
                json.customer = json.customer_id;

                delete json.status_id;
                delete json.customer_id;
            }
        }
    }
);

const Job = Model('Job', jobSchema);

export default Job;