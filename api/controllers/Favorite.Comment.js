import { database } from "../database.js";
import jwt from 'jsonwebtoken'

const getFavorite = (req, res) => {
    const q = "SELECT adminId, commentId FROM favoritecomments WHERE postId = ?";

    database.query(q, [req.query.postId], (err, data) => {
        if (err) { return res.status(500).json(err); }
        return res.status(200).json(data);
    })
}

const addFavorite = (req, res) => {
    const token = req.cookies.admin_access_token;
    if (!token) { return res.status(401).json("Token không được xác thực!"); }

    jwt.verify(token, 'admin_jwtkey', (err, userInfo) => {
        if (err) { return res.status(403).json("Token không hợp lệ!"); }
        const q = "INSERT INTO favoritecomments (`adminId`, `commentId`, `postId`) VALUES (?, ?, ?)";
        const values = [
            userInfo.id,
            req.body.commentId,
            req.body.postId,
        ];

        database.query(q, values, (err, data) => {
            if (err) { return res.status(500).json(err); }
            return res.status(200).json("Bài viết đã được yêu thích!");
        });
    });
}

const deleteFavorite = (req, res) => {
    const token = req.cookies.admin_access_token;
    if (!token) { return res.status(401).json("Token không được xác thực!"); }

    jwt.verify(token, 'admin_jwtkey', (err, userInfo) => {
        if (err) { return res.status(403).json("Token không hợp lệ!"); }
        const q = "DELETE FROM favoritecomments WHERE `adminId` = ? AND `postId` = ? AND `commentId` = ?";
        database.query(q, [userInfo.id, req.query.postId, req.query.commentId], (err, data) => {
            if (err) { return res.status(500).json(err); }
            return res.status(200).json("Bình luận đã yêu thích!");
        });
    });
};

export { getFavorite, addFavorite, deleteFavorite };
