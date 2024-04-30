import express from 'express'
import { allUser, deleteUser, updateUserProfile } from '../controllers/User.js';

const router = express.Router();

router.get("/", allUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUserProfile);

export default router;