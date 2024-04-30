import express from 'express'
import { infoAdmin, updateAdminProfile } from '../controllers/Admin.js'

const router = express.Router();

router.get("/", infoAdmin);
router.put("/:id", updateAdminProfile)

export default router;