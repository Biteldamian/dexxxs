import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { router as documentRouter } from './routes/documents';
import { router as taskRouter } from './routes/tasks';
import { router as trainingRouter } from './routes/training';
import { router as chatRouter } from './routes/chat';
import { setupDatabase } from './db';
import { setupChroma } from './services/chroma';
import { setupOllama } from './services/ollama';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/documents', documentRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/training', trainingRouter);
app.use('/api/chat', chatRouter);

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Initialize services
async function initializeServer() {
  try {
    await setupDatabase();
    await setupChroma();
    await setupOllama();

    const port = process.env.PORT || 3001;
    httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initializeServer();