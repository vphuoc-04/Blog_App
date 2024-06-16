import { database } from "../database.js";
import jwt from 'jsonwebtoken'

export const checkComments = (req, res) => {
    const q = "SELECT * FROM comments";

    database.query(q, (err, data) => {
        if(err) { return res.json(err) }
        return res.status(200).json(data);
    })
}

export const getComments = (req, res) => {
    const q = "SELECT c.id, u.username, c.comment, u.img, c.date FROM users u JOIN comments c ON u.id = c.uidc JOIN posts p ON p.id = c.postId WHERE c.postId = ?";

    database.query(q, [req.params.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const addComments = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Không được xác thực!');

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token không hợp lệ!');

        const postUrl = req.body.postUrl;

        const getPostIdQuery = 'SELECT id FROM posts WHERE url = ?';
        database.query(getPostIdQuery, [postUrl], (err, results) => {
            if (err) return res.status(500).json(err);
            if (results.length === 0) return res.status(404).json('Bài viết không tồn tại!');

            const postId = results[0].id;
            const q = 'INSERT INTO comments(`comment`, `date`, `uidc`, `username`, `img`, `postId`) VALUES (?)';
            const values = [
                req.body.comment,
                req.body.date,
                userInfo.id,
                req.body.username,
                req.body.img,
                postId
            ];

            database.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.json('Comment đã được cập nhật!');
            });
        });
    });
};
