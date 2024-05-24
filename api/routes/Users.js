import express from 'express'
import { allUser, changePassword, deleteUser, updateUserProfile, uploadAvatar } from '../controllers/User.js';

const router = express.Router();

router.get("/", allUser);
router.delete("/:id", deleteUser);
router.put("/:id", uploadAvatar);
router.put("/:id", changePassword)
router.put("/:id", updateUserProfile);

export default router;