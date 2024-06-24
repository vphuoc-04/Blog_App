import { database } from "../database.js";
import jwt from 'jsonwebtoken';

export const getReplyComments = (req, res) => {
    const q = `SELECT rc.*, u.id AS userId, u.username, u.img
               FROM replycomments rc
               JOIN users u ON rc.userId = u.id
               JOIN comments c ON rc.commentId = c.id
               JOIN posts p ON c.postId = p.id
               WHERE p.id = ?`;

    database.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const addReplyComment = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Không được xác thực!");

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json("Token không hợp lệ!");

        const q = "INSERT INTO replycomments(`replycomment`, `date`, `username`, `img`, `commentId`, `postId`, `userId`) VALUES (?)";
        const values = [
            req.body.replycomment,
            req.body.date,
            req.body.username,
            req.body.img,
            req.body.commentId,
            req.body.postId,
            userInfo.id,
        ];

        database.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json('Comment đã được cập nhật!');
        });
    });
};
