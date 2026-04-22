import express from 'express';
import authRoutes from './routes/authRoutes';
import chatsRoutes from './routes/chatRoutes';
import messagesRoutes from './routes/messageRoutes';
import usersRoutes from './routes/userRoutes';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies 

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

app.use("api/auth", authRoutes);
app.use("api/chats", chatsRoutes);
app.use("api/messages", messagesRoutes);
app.use("api/users", usersRoutes);

export default app;