import express from 'express'
import { 
    addfavoriteComments, 
    changePassword, 
    deleteFavoriteComments, 
    getfavoriteComments, 
    infoAdmin, 
    updateAdminProfile, 
    uploadAvatar 
} from '../controllers/Admin.js'

const router = express.Router();

router.get("/", infoAdmin);
router.put("/avatar/:id", uploadAvatar);
router.put("/password/:id", changePassword);
router.put("/profile/:id", updateAdminProfile)
router.get("/comments/favorite", getfavoriteComments);
router.post("/comments/addfavorite", addfavoriteComments);
router.put("/comments/deletefavorite", deleteFavoriteComments);

export default router;