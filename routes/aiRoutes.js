const express = require('express');
const router = express.Router();
const {handlePrompt, generateImage} = require('../controllers/aiController')
const authMiddleware = require('../middlewares/jwtAuthMiddlware');

// Route to send prompt to the ai model
router.post('/', authMiddleware, handlePrompt)
router.post('/image-gen', authMiddleware, generateImage)

module.exports = router;