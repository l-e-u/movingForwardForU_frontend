import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const feeSchema = new Schema({
    amount: {
        required: [true, 'Needs an amount.'],
        type: Number,
    },
    createdBy: {
        ref: 'User',
        required: Schema.Types.ObjectId,
        type: Schema.Types.ObjectId,
    },
    description: {
        required: [true, 'Cannot be empty.'],
        trim: true,
        type: String,
    },
    name: {
        required: [true, 'Cannot be empty.'],
        trim: true,
        type: String,
        unique: true,
    },
});

feeSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

export default Model('Fee', feeSchema);