import { database } from "../database.js";
import jwt from 'jsonwebtoken'

export const getComments = (req, res) => {
    const q = "SELECT c.id, c.uidc, u.username, c.comment, u.img, c.date FROM users u JOIN comments c ON u.id = c.uidc JOIN posts p ON p.id = c.postId WHERE c.postId = ? AND c.parentId IS NULL";
    database.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const addComments = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Không được xác thực!');

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token không hợp lệ!');

        const q = 'INSERT INTO comments(`comment`, `date`, `uidc`, `username`, `img`, `postId`, `parentId`) VALUES (?)';
        const values = [
            req.body.comment,
            req.body.date,
            userInfo.id,
            req.body.username,
            req.body.img,
            req.body.postId,
            req.body.parentId || null
        ];

        database.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json('Comment đã được cập nhật!');
        });
    });
};

export const getReplyComment = (req, res) =>{
    const q = "SELECT c.id, c.uidc, u.username, c.comment, u.img, c.date, c.parentId FROM users u JOIN comments c ON u.id = c.uidc JOIN posts p ON p.id = c.postId WHERE c.postId = ? AND c.parentId IS NOT NULL";
    database.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const addReplyComments = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Không được xác thực!');

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token không hợp lệ!');

        const q = 'INSERT INTO comments(`comment`, `date`, `uidc`, `username`, `img`, `postId`, `parentId`) VALUES (?)';
        const values = [
            req.body.comment,
            req.body.date,
            userInfo.id,
            req.body.username,
            req.body.img,
            req.body.postId,
            req.body.parentId
        ];

        database.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json('Reply comment đã được cập nhật!');
        })
    })
}

export const deleteComments = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { return res.status(401).json('Không được xác thực!'); }

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if(err) { return res.status(403).json('Token không hợp lệ!'); }

        const commentId = req.params.id;
        const parentId = req.query.parentId;
        let q, queryValues;

        if (!commentId) { return res.status(400).json('Thiếu thông tin id!') }
        if(parentId){
            q = "DELETE FROM comments WHERE `id` = ? AND `parentId` = ?";
            queryValues = [commentId, parentId];
        } 
        else{
            q = "DELETE FROM comments WHERE `id` = ?";
            queryValues = [commentId];
        }

        database.query(q, queryValues, (err, data) => {
            if(err) { return res.status(500).json(err); }
            return res.json('Đã xóa!');
        });
    });
};


export const editComments = (req, res) => {
    const token = req.cookies.access_token;
    if(!token) { return res.status(401).json('Không được xác thực!') }

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token không hợp lệ!');
        const q = "UPDATE comments SET `comment` = ?, `date` = ?  WHERE `id` = ?";
        const values = [
            req.body.comment,
            req.body.date
        ];

        database.query(q, [ ...values, req.params.id], (err, data) => {
            if(err) { return res.status(500).json(err) }
            return res.json('Đã chỉnh sửa!');
        });
    });
};
