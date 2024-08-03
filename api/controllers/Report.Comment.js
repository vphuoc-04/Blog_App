import { database } from '../database.js'
import jwt from 'jsonwebtoken'

const getReport = (req, res) => {
    
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