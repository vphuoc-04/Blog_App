import express from 'express'
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.js';
import PostRoutes from './routes/Posts.js';
import UserRoutes from './routes/Users.js';
import AdminRoutes from './routes/Admin.js';
import CommentRoutes from './routes/Comments.js';
import LikeCommentsRoutes from './routes/Likes.Comment.js';
import FavoriteCommentRoutes from './routes/Favorite.Comments.js'
import AdminCommentsRoutes from './routes/Comments.Admin.js'
import ReportCommentRoutes from './routes/Report.Comments.js'
import { handleUpload } from './uploads/ImageManagement.js';
import { userAvatar } from './uploads/UserAvatar.js';
import { adminAvatar } from './uploads/AdminAvatar.js';

import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", AuthRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/comments", CommentRoutes);
app.use("/api/likecomments", LikeCommentsRoutes);
app.use("/api/favoritecomments", FavoriteCommentRoutes);
app.use("/api/admincomments", AdminCommentsRoutes);
app.use("/api/reportcomments", ReportCommentRoutes);
app.post("/api/upload", handleUpload);
app.post("/api/user-avatar", userAvatar);
app.post("/api/admin-avatar", adminAvatar);

app.listen(8800, () => {
    console.log("Connected!");
})
