import express from 'express'
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", AuthRoutes);

app.listen(8800, () => {
    console.log("Connected!");
})
