import express from 'express'
import { addComments, checkComments, getComments } from '../controllers/Comment.js';

const router = express.Router();

router.get("/", checkComments);
router.get("/:postId", getComments);
router.post("/", addComments);

export default router;