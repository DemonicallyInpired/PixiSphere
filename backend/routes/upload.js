import express from 'express';
import { uploadSingle, handleUpload } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload
router.post('/', uploadSingle, handleUpload);

export default router;

