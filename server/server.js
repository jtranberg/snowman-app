import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import dataRoutes from './routes/data.js';
import logsRouter from './routes/logs.js';
import path from "path";
import process from "process";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/data', dataRoutes);
app.use('/api/logs', logsRouter);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB error:', err));
