import express from 'express'
import { changePassword, infoAdmin, updateAdminProfile, uploadAvatar } from '../controllers/Admin.js'

const router = express.Router();

router.get("/", infoAdmin);
router.put("/:id", uploadAvatar);
router.put("/:id", changePassword);
router.put("/:id", updateAdminProfile)

export default router;