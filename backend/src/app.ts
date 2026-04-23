import express from 'express';
import { clerkMiddleware } from '@clerk/express'
import authRoutes from './routes/authRoutes';
import chatsRoutes from './routes/chatRoutes';
import messagesRoutes from './routes/messageRoutes';
import usersRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(clerkMiddleware())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/users", usersRoutes);

// error handlers must come after all the routes and other middlewares so they can catch errors passed with next(err) or thrown inside async handlers.
app.use(errorHandler);

export default app;