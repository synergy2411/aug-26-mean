import express from 'express';
import authRoutes from './routes/auth.routes.js';
    import connectDB from './utils/db.js';
    import dotenv from 'dotenv';
    dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);


app.get('/', (req, res) => {
    res.send('Hello World');
});

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})