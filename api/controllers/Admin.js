import { database } from "../database.js";
import jwt from 'jsonwebtoken'

export const infoAdmin = (req, res) => {
    const q = "SELECT * FROM admin"
    database.query(q, (err, data) => {
        if(err) { return res.json(err) }
        return res.json(data);
    })
}

export const updateAdminProfile = (req, res) => {
    const token = req.cookies.admin_access_token;
    if (!token) { return res.status(401).json("Không được xác thực!"); }
    jwt.verify(token, "admin_jwtkey", async (err, userInfo) => { 
        if (err) { return res.status(403).json("Token không hợp lệ!") }
  
        const adminId = req.params.id;
        const getPassword = "SELECT `password` FROM admin WHERE `id` = ?";
  
        database.query(getPassword, [adminId], async (err, result) => {
            if (err) { return res.status(500).json(err) }
  
            const adminPassword = result[0].password;
            if (req.body.oldPassword !== adminPassword) {
                return res.status(400).json("Mật khẩu cũ không đúng");
            }
            else{
                const updateUser = "UPDATE admin SET `username` = ?, `email` = ?, `password` = ? WHERE `id` = ?";
                const values = [req.body.username, req.body.email, req.body.newPassword, adminId];
    
                database.query(updateUser, values, (err, data) => {
                    if (err) { return res.status(500).json(err) }
                    return res.json("Thông tin đã được cập nhật!");
                });
            }
        });
    });
};
