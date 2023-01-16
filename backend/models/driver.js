import { Schema, model as Model } from 'mongoose';

const driverSchema = new Schema(
    {
        specialty: {
            type: Boolean,
            default: false,
        }
    }
);

const Driver = Model('Driver', driverSchema);

export default Driver;