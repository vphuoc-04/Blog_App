import express from 'express'
import { 
    getReport, 
    addReport, 
    deletReport 
} from '../controllers/Report.Comment.js';

const router = express.Router();

router.get("/", getReport);
router.post("/report/add", addReport);
router.delete("/report/delete", deletReport);

export default router;