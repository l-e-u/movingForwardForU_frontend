import { Schema, model as Model } from "mongoose";

const stopSchema = new Schema(
    {
        action: {
            type: Schema.Types.ObjectId,
            ref: 'Action'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        dateTime: Date,
        address: String,
        description: String
    },
    { timestamps: true }
);

export default Model('Stop', stopSchema);