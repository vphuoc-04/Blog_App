import { database } from '../database.js'
import jwt from 'jsonwebtoken'

const getReport = (req, res) => {
    const q = "SELECT r.* FROM reportcomments r JOIN users u ON r.userId = u.id JOIN comments c ON r.commentId = c.id JOIN posts p ON r.postId = p.id";
    database.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

const addReport = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Không được xác thực!');
    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token không hợp lệ!');

        const q = 'INSERT INTO reportcomments(`username`, `img`, `report`, `date`, `userId`, `postId`, `commentId`, `userReported`, `commentReported`) VALUES (?)';

        const values = [
            req.body.username,
            req.body.img,
            req.body.report,
            req.body.date,
            req.body.userId,
            req.body.postId,
            req.body.commentId,
            req.body.userReported,
            req.body.commentReported
        ];

        database.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json('Comment đã được cập nhật!');
        })
    })
}

const deletReport = (req, res) => {

}

export { getReport, addReport, deletReport }