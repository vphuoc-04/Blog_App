import express from 'express'
import { getPost, checkPost, addPost, deletePost, updatePost } from '../controllers/Post.js'

const router = express.Router();

router.get("/", checkPost);
router.get("/:id", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

export default router;