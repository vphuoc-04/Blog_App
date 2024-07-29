import express from 'express'
import { 
    changePassword, 
    infoAdmin, 
    updateAdminProfile, 
    uploadAvatar 
} from '../controllers/Admin.js'

const router = express.Router();

router.get("/", infoAdmin);
router.put("/avatar/:id", uploadAvatar);
router.put("/password/:id", changePassword);
router.put("/profile/:id", updateAdminProfile)

export default router;