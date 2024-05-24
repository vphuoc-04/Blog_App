import { database } from "../database.js";
import jwt from 'jsonwebtoken'
import speakingurl from 'speakingurl'

export const checkPost = (req, res) => {
    const q = req.query.life
        ? "SELECT * FROM posts WHERE life = ?"
        : "SELECT * FROM posts";

        database.query(q, [req.query.life], (err, data) => {
            if(err) { return res.send(err) }
            return res.status(200).json(data);
        })
}

export const getPost = (req, res) => {
    const q = "SELECT p.id, `username`, `title`, `introdes`, `des`, p.img, `date` FROM admin a JOIN posts p ON a.id=p.uid WHERE p.url = ?";

    database.query(q, [req.params.id], (err, data) => {
        if(err) { return res.json(err) }
        return res.status(200).json(data[0]);
    })
}

export const addPost = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token không hợp lệ!");

        const title = req.body.title;
        const url = speakingurl(title);
        const q = "INSERT INTO posts(`title`,`introdes`,`des`,`img`,`date`,`uid`,`url`) VALUES (?)";

        const values = [
            req.body.title,
            req.body.introdes,
            req.body.des,
            req.body.img,
            req.body.date,
            userInfo.id,
            url
        ]

        database.query(q, [values], (err, data) => {
            if(err) { return res.status(500).json(err) }
            return res.json("Bài viết đã được đăng tải!")
        })
    });
}

export const deletePost = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
        if(err) { return res.status(403).json("Token không hợp lệ!") }
        
        const postId = req.params.id;
        const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

        database.query(q, [postId, userInfo.id], (err, data) => {
            if(err) { return res.status(403).json("Không thể xóa bài viết!") }

            return res.json("Bài viết đã được xóa");
        })
    })
}

export const updatePost = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) => {
        if(err) { return res.status(403).json("Token không hợp lệ!") }

        const postId = req.params.id;
        const q = "UPDATE posts SET `title` = ?,`introdes` = ?,`des` = ?,`img` = ? WHERE `id` = ? AND `uid` = ?";

        const values = [
            req.body.title,
            req.body.introdes,
            req.body.des,
            req.body.img,
        ]

        database.query(q, [...values, postId, userInfo.id], (err, data) => {
            if(err) { return res.status(500).json(err) }
            return res.json("Bài viết đã được cập nhật!");
        })
    })
}