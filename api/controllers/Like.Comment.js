import { database } from "../database.js";
import jwt from 'jsonwebtoken';

export const getLikes = (req, res) => {
    const q = "SELECT userId, commentId FROM likecomments WHERE postId = ?";

    database.query(q, [req.query.postId], (err, data) => {
        if (err) { return res.status(500).json(err); }
        return res.status(200).json(data);
    });
};


export const addLike = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { return res.status(401).json("Token không được xác thực!"); }

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) { return res.status(403).json("Token không hợp lệ!"); }
        const q = "INSERT INTO likecomments (`userId`, `postId`, `commentId`) VALUES (?, ?, ?)";
        const values = [
            userInfo.id,
            req.body.postId,
            req.body.commentId
        ];

        database.query(q, values, (err, data) => {
            if (err) { return res.status(500).json(err); }
            return res.status(200).json("Bài viết đã được tim!");
        });
    });
};


export const deleteLike = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { return res.status(401).json("Token không được xác thực!"); }

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) { return res.status(403).json("Token không hợp lệ!"); }
        const q = "DELETE FROM likecomments WHERE `userId` = ? AND `postId` = ? AND `commentId` = ?";
        database.query(q, [userInfo.id, req.query.postId, req.query.commentId], (err, data) => {
            if (err) { return res.status(500).json(err); }
            return res.status(200).json("Bình luận đã hủy tim!");
        });
    });
};
