import { database } from "../database.js";
import jwt from 'jsonwebtoken'

export const infoAdmin = (req, res) => {
    const q = "SELECT * FROM admin"
    database.query(q, (err, data) => {
        if(err) { return res.json(err) }
        return res.json(data);
    })
}

export const uploadAvatar = (req, res) => {
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

export const changePassword = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) =>{
        if(err) { return res.status(403).json("Token không hợp lệ!") }

        const adminId = req.params.id;
        const getUserPassword = "SELECT `password` FROM admin WHERE `id` = ?";

        database.query(getUserPassword, [adminId], async (err, result) => {
            if (err) { return res.status(500).json(err) }

            const userPassword = result[0].password;
            const isPasswordCorrect = bcrypt.compareSync(req.bod.oldPassword, userPassword);
            if(!isPasswordCorrect) { return res.status(400).json("Mật khẩu không đúng!") }
            else{
                const hashedNewPassword = bcrypt.hashSync(req.bod.newPassword, 10);
                const updatePassword = "UPDATE admin SET `password` = ? WHERE `id` = ?";
                const value = [hashedNewPassword, adminId];
                database.query(updatePassword, value, (err, data) => {
                    if (err) { return res.status(500).json(err) }
                    return res.json("Mật khẩu đã đượcc thay đổi!");
                })
            }
        })
    })
}

export const updateAdminProfile = (req, res) => {
    const token = req.cookies.admin_access_token;
    if(!token) { return res.status(401).json("Không được xác thực!") }
    jwt.verify(token, "admin_jwtkey", (err, userInfo) =>{
        if(err) { return res.status(403).json("Token không hợp lệ!") }

        const adminId = req.params.id;
        const q = "UPDATE admin SET `username` = ?, `email` = ? WHERE `id` = ?";
        const values = [req.bod.username, req.body.email];

        database.query(q, [values, adminId], (err, data) => {
            if(err) { return res.status(403).json("Thông tin chưa được cập nhật!") }
            return res.json("Thông tin đã được cập nhật!");
        })
    })
}

