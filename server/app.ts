import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import membershipRoutes from './routes/membership.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/membership', membershipRoutes);

app.get('/', (req, res) => {
    res.send('LegiTech AI Pro API is running');
});

export default app;
