import { database } from "../database.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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

export const updateUserProfile = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) { return res.status(401).json("Không được xác thực!"); }
  jwt.verify(token, "jwtkey", async (err, userInfo) => { 
      if (err) { return res.status(403).json("Token không hợp lệ!") }

      const userId = req.params.id;
      const getUserPassword = "SELECT `password` FROM users WHERE `id` = ?";

      database.query(getUserPassword, [userId], async (err, result) => {
          if (err) { return res.status(500).json(err) }

          const userPassword = result[0].password;
          const isPasswordCorrect = bcrypt.compareSync(req.body.oldPassword, userPassword);
          if (!isPasswordCorrect) {
              return res.status(400).json("Mật khẩu cũ không đúng");
          }
          else{
            const hashedNewPassword = bcrypt.hashSync(req.body.newPassword, 10);

            const updateUser = "UPDATE users SET `username` = ?, `email` = ?, `password` = ? WHERE `id` = ?";
            const values = [req.body.username, req.body.email, hashedNewPassword, userId];

            database.query(updateUser, values, (err, data) => {
                if (err) { return res.status(500).json(err) }
                return res.json("Thông tin đã được cập nhật!");
            });
          }
      });
  });
};

