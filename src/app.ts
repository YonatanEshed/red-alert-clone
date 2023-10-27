import express from 'express';
import alertRoutes from './routes/alertRoutes';

const app = express();

// routes
app.use('/alerts', alertRoutes);

app.get('/', (req, res) => {
    res.end('home');
});

const server = app.listen(3000, () => {
    console.log(`server is running on port 3000`);
});
