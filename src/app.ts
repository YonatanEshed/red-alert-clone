import express from 'express';
import alertRoutes from './routes/alertRoutes';
import locationRoutes from './routes/locationRoutes';

const app = express();

// routes
app.use('/alerts', alertRoutes);
app.use('/locations', locationRoutes);

app.get('/', (req, res) => {
    res.end('home');
});

const server = app.listen(3000, () => {
    console.log(`server is running on port 3000`);
});
