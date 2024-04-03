import { database } from "../database.js";

export const infoAdmin = (req, res) => {
    const q = "SELECT * FROM admin"
    database.query(q, (err, data) => {
        if(err) { return res.json(err) }
        return res.json(data);
    })
}