import 'dotenv/config';
import express, { json } from 'express';
import { connectToDatabase } from './models/index.js';
import jobRoutes from './routes/jobs.js';
import cors from 'cors';

const PORT = process.env.PORT;

// express app
const app = express();
app.use(cors());


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
        app.listen(PORT, () => {
            console.log('Server started on port:', PORT);
        });
    })
    .catch((error) => {
        console.error(error);
    });

export default app;