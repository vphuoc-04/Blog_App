import express from 'express'
import { allUser, changePassword, deleteUser, updateUserProfile, uploadAvatar } from '../controllers/User.js';

const router = express.Router();

router.get("/", allUser);
router.delete("/:id", deleteUser);
router.put("/avatar/:id", uploadAvatar);
router.put("/password/:id", changePassword)
router.put("/profile/:id", updateUserProfile);

export default router;