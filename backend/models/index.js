import mongoose from 'mongoose';

import Job from './job.js';
import Status from './status.js'

mongoose.set('strictQuery', false);

const connectToDatabase = () => {
    return mongoose.connect(process.env.MONGO_URI);
};

const models = { Job, Status };

export { connectToDatabase };

export default models;