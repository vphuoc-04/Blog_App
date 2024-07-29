import { database } from "../database.js";
import jwt from 'jsonwebtoken'

const infoAdmin = (req, res) => {
    const q = "SELECT * FROM admin"
    database.query(q, (err, data) => {
        if(err) { return res.json(err) }
        return res.json(data);
    })
}

const uploadAvatar = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) =>{
        if(err) { return res.status(403).json("Token không hợp lệ!") }

        const q = "UPDATE admin SET `img` = ? WHERE `id` = ?";

        database.query(q, [req.body.img, userInfo.id], (err, data) => {
            if(err) { return res.status(403).json("Không thể xóa người dùng!") }
            return res.json("Ảnh đại diện mới đã được cập nhật!");
        })
    })
}

const changePassword = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) =>{
        if(err) { return res.status(403).json("Token không hợp lệ!") }

        const adminId = req.params.id;
        const getAdminPassword = "SELECT `password` FROM admin WHERE `id` = ?";

        database.query(getAdminPassword, [adminId], async (err, result) => {
            if (err) { return res.status(500).json(err) }
            const adminPassword = result[0].password;
            if (req.body.oldPassword !== adminPassword) {
                return res.status(400).json("Mật khẩu cũ không đúng");
            }
            else{
                const updatePassword = "UPDATE admin SET `password` = ? WHERE `id` = ?";
                const values = [req.body.newPassword, adminId];

                database.query(updatePassword, values, (err, data) => {
                    if (err) { return res.status(500).json(err) }
                    return res.json("Thông tin đã được cập nhật!");
                });
            }
        });
    })
}

const updateAdminProfile = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) =>{
        if(err) { return res.status(403).json("Token không hợp lệ!") }

        const adminId = req.params.id;
        const q = "UPDATE admin SET `username` = ?, `email` = ? WHERE `id` = ?";
        const values = [req.body.username, req.body.email, adminId];

        database.query(q, values, (err, data) => {
            if(err) { return res.status(403).json("Thông tin chưa được cập nhật!") }
            return res.json("Thông tin đã được cập nhật!");
        })
    })
}

export { infoAdmin, uploadAvatar, changePassword, updateAdminProfile }