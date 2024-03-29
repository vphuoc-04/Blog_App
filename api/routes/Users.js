import express from 'express'
import { allUser, deleteUser } from '../controllers/User.js';

const router = express.Router();

router.get("/", allUser);
router.delete("/:id", deleteUser)

export default router;