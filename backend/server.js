import 'dotenv/config';
import express, { json } from 'express';
import models, { connectToDatabase } from './models/index.js';
import jobRoutes from './routes/jobs.js';

// express app
const app = express();

// middleware
app.use(json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/jobs', jobRoutes);

// connect to db
connectToDatabase(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Server started on port 3000');
        });
    })
    .catch((error) => {
        console.error(error);
    });

export default app;