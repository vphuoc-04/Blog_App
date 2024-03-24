import express from 'express'
import { register, login, logout, loginAdmin, logoutAdmin } from '../controllers/Auth.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/loginAdmin', loginAdmin);
router.post('/logoutAdmin', logoutAdmin);

export default router;
