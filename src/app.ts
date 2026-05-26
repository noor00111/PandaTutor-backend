import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import tutorRoutes from './routes/tutorRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';

export const app: Express = express();

// ----------middlewares--------- //
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('PandaTutor API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

app.use(errorHandler);
