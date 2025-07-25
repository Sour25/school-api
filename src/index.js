import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.routes.js';
import courseRoutes from './routes/course.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import { serveSwagger, setupSwagger } from './config/swagger.js';
import { authenticateToken } from './middlewares/auth.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// Swagger docs
app.use('/docs', serveSwagger, setupSwagger);

// Protect all /students routes with authenticateToken middleware
app.use('/students', authenticateToken, studentRoutes);

// Other routes without authentication
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('Welcome to School API!'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
