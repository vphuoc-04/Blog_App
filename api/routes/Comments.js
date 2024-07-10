import express from 'express'
import { getComments, addComments, deleteComments, editComments, addReplyComments, getReplyComment } from '../controllers/Comment.js';

const router = express.Router();

router.get("/data/comment", getComments);
router.post("/comment", addComments);
router.get("/data/reply", getReplyComment);
router.post("/comment/reply", addReplyComments);
router.delete("/delete/:id", deleteComments);
router.put("/edit/:id", editComments);

export default router;