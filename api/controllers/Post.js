import { database } from "../database.js";
import jwt from 'jsonwebtoken'

export const getPosts = (req, res) => {
    const q = req.query.life
        ? "SELECT * FROM posts WHERE life = ?"
        : "SELECT * FROM posts";

        database.query(q, [req.query.life], (err, data) => {
            if(err) { return res.send(err) }
            return res.status(200).json(data);
        })
}

export const getPost = (req, res) => {
    const q = "SELECT p.id, `username`, `title`, `des`, p.img, `life`, `date` FROM admin a JOIN posts p ON a.id=p.uid WHERE p.id = ?";

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

        const q = "INSERT INTO posts(`title`,`des`,`img`,`life`,`date`,`uid`) VALUES (?)";

        const values = [
            req.body.title,
            req.body.des,
            req.body.img,
            req.body.life,
            req.body.date,
            userInfo.id
        ]

        database.query(q, [values], (err, data) => {
            if(err) { return res.status(500).json(err) }
            return res.json("Post has been created")
        })
    });
}

export const deletePost = (req, res) => {
    res.json("from controller")
}

export const updatePost = (req, res) => {
    res.json("from controller")
}