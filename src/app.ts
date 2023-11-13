import express from 'express';
import bodyParser from 'body-parser';

import alertRoutes from './routes/alertRoutes';
import locationRoutes from './routes/locationRoutes';
import authRoutes from './routes/authRoutes';

// express app
const app = express();

// middlewares
app.use(bodyParser.json());

// routes
app.use('/admin', authRoutes);
app.use('/alerts', alertRoutes);
app.use('/locations', locationRoutes);

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
