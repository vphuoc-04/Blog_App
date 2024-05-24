import { database } from '../database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const makeRandomId = () => {
    const min = 100000;
    const max = 999999;

    return Math.floor(Math.random () * (max - min + 1 )) + min;
}

const isIdUnique = (id) => {
    return new Promise((resolve, reject) => {
        const q = "SELECT COUNT(*) AS count FROM users WHERE id = ?";
        database.query(q, [id], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data[0].count === 0);
            }
        });
    });
}

export const register = async (req, res) => {
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    database.query(q, [req.body.email, req.body.username], async (err, data) => {
        if (err) { return res.json(err) }
        if (data.length) { return res.status(409).json("Tài khoản đã tồn tại!") }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        let randomId = makeRandomId();
        while (!(await isIdUnique(randomId))) {
            randomId = generateRandomId();
        }

        const q = "INSERT INTO users(`id`,`username`,`email`,`password`,`img`) VALUES(?)";
        const values = [
            randomId,
            req.body.username,
            req.body.email,
            hash,
            req.body.img,
        ]

        database.query(q, [values], (err, data) => {
            if(err) { return res.json(err) }
            return res.status(200).json("Tài khoản đã được tạo thành công!");
        })
    })
}

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    database.query(q, [req.body.username], (err, data) => {
        if (err) { return res.json(err) }
        if (data.length === 0 ) { return res.status(404).json("Tài khoản không tồn tại") }

        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );
        if (!isPasswordCorrect) { return res.status(400).json("Sai thông tin đăng nhập!") }

        const token = jwt.sign({ id: data[0].id }, "jwtkey");
        const { password, ...other } = data[0];

        res
        .cookie("access_token", token , {
            httpOnly: true,
        })
        .status(200)
        .json(other)
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("Tài khoản đã được đăng xuất!")
}

export const loginAdmin = (req, res) => {
    const q = "SELECT * FROM admin WHERE username = ?";
    database.query(q, [req.body.username], (err, data) => {
        if (err) { return res.json(err) }

        if (data.length === 0) { return res.status(404).json("Tài khoản không tồn tại") }

        const admin = data[0];
        if (req.body.password !== admin.password) {
            return res.status(400).json("Sai thông tin đăng nhập!");
        }

        const token = jwt.sign({ id: data[0].id }, "admin_jwtkey");
        const { password, ...adminInfo } = data[0];

        res
        .cookie("admin_access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json(adminInfo);
    });
}

export const logoutAdmin = (req, res) => {
    res.clearCookie("admin_access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("Tài khoản đã được đăng xuất!")
}