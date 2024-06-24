import express from 'express';
import { getReplyComments, addReplyComment } from '../controllers/Reply.Comment.js';

const router = express.Router();

router.get("/", getReplyComments);
router.post("/", addReplyComment);

export default router;
