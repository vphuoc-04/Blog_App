import express from 'express'
import { infoAdmin } from '../controllers/Admin.js'

const router = express.Router();

router.get("/", infoAdmin);

export default router;