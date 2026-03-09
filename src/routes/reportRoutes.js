import express from 'express';
import { printInspectors } from '../controllers/inspectorController.js';

const router = express.Router();

router.get('/inspectors', printInspectors);

export default router;