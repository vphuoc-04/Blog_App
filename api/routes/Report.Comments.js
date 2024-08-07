import express from 'express'
import { 
    getReport, 
    addReport, 
    deletReport 
} from '../controllers/Report.Comment.js';

const router = express.Router();

router.get("/report/data", getReport);
router.post("/report/add", addReport);
router.delete("/report/delete/:id", deletReport);

export default router;