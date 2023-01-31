import 'dotenv/config';
import express, { json } from 'express';
import { connectToDatabase } from './models/index.js';
import cors from 'cors';

// routes
import jobRoutes from './routes/jobs.js';
import statusRoutes from './routes/status.js';
import usersRoutes from './routes/users.js';
import contactRoutes from './routes/contacts.js';

const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

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
app.use('/api/status', statusRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contacts', contactRoutes);

// connect to db
connectToDatabase(URI)
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