import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";

dotenv.config()

const app = express()

app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:3002", "http://localhost:3000"],
    credentials: true,
}));

app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))