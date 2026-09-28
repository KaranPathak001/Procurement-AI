import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ProcureAI Backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ProcureAI Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Database Connection & Server Launch
async function startServer() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/procureai';

  try {
    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to MongoDB at ${mongoUri}`);
  } catch (dbErr) {
    console.error(`❌ MongoDB connection failed:`, dbErr);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 ProcureAI Server running on port ${PORT} [http://localhost:${PORT}]`);
  });
}

startServer();
