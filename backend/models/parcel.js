import { Schema, model as Model } from 'mongoose';

const parcelSchema = new Schema({
    customer_id: String,
    from: String,
    to: String,
    transit: {
        type: Array,
        default: [],
    }
});

const Parcel = Model('Parcel', parcelSchema);

export default Parcel;