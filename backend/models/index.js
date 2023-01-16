import mongoose from 'mongoose';

import Job from './job.js';

mongoose.set('strictQuery', false);

const connectToDatabase = () => {
    return mongoose.connect(process.env.MONGO_URI);
};

const models = { Job };

export { connectToDatabase };

export default models;