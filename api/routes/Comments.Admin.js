import express from 'express'
import { 
    addCommentsAdmin, 
    addReplyCommentsAdmin, 
    deleteCommentsAdmin, 
    editCommentsAdmin, 
    getCommentsAdmin, 
    getReplyCommentAdmin 
} from '../controllers/Comment.Admin.js';

const router = express.Router();

router.get("/", getCommentsAdmin);
router.post("/", addCommentsAdmin);
router.get("/", getReplyCommentAdmin);
router.post("/", addReplyCommentsAdmin);
router.delete("/", deleteCommentsAdmin);
router.put("/", editCommentsAdmin)

export default router;