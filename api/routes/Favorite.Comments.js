import express from 'express'
import { 
    getFavorite, 
    addFavorite, 
    deleteFavorite 
} from '../controllers/Favorite.Comment.js'

const router = express.Router();

router.get("/", getFavorite);
router.post("/", addFavorite);
router.delete("/", deleteFavorite);

export default router;