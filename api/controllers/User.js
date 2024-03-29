import { database } from "../database.js"
import jwt from 'jsonwebtoken'

export const allUser = (req, res) => {
    const q = "SELECT * FROM users"
    database.query(q, (err, data) => {
        if(err) { return res.json(err) }
        return res.json(data);
    })
}

export const deleteUser = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) =>{
        if(err) { return res.status(403).json("Token không hợp lệ!") }
        const userId = req.params.id;
        
        const q = "DELETE FROM users WHERE `id` = ?";
        database.query(q, [userId, userInfo.id], (err, data) => {
            if(err) { return res.status(403).json("Không thể xóa người dùng!") }
            return res.json("Người dùng đã được xóa!");
        })
    })
}