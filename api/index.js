import express from 'express'
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.js';
import PostRoutes from './routes/Posts.js'
import UserRoutes from './routes/Users.js'
import AdminRoutes from './routes/Admin.js'
import { handleUpload } from './uploads/ImageManagement.js';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", AuthRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.post("/api/upload", handleUpload);

app.listen(8800, () => {
    console.log("Connected!");
})
