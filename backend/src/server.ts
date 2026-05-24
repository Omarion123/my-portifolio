import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/database';
import { seedIfEmpty } from './config/seedIfEmpty';
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolio';
import projectsRoutes from './routes/projects';
import skillsRoutes from './routes/skills';
import experienceRoutes from './routes/experience';
import educationRoutes from './routes/education';
import certificationsRoutes from './routes/certifications';
import blogRoutes from './routes/blog';
import contactRoutes from './routes/contact';
import uploadRoutes from './routes/upload';
import identityRoutes from './routes/identity';
import webAuthnRoutes from './routes/webauthn';
import githubRoutes from './routes/github';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/auth',           authRoutes);
app.use('/api/portfolio',      portfolioRoutes);
app.use('/api/projects',       projectsRoutes);
app.use('/api/skills',         skillsRoutes);
app.use('/api/experience',     experienceRoutes);
app.use('/api/education',      educationRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/posts',          blogRoutes);
app.use('/api/contact',        contactRoutes);
app.use('/api/upload',         uploadRoutes);
app.use('/api/identity',       identityRoutes);
app.use('/api/webauthn',       webAuthnRoutes);
app.use('/api/github',         githubRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

connectDB().then(async () => {
  await seedIfEmpty();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
