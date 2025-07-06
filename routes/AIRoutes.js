const express = require('express');
const router = express.Router();
const {handlePrompt, generateImage} = require('../controllers/AIController')
const jwtAuthMiddleware = require('../Middlewares/jwtAuthMiddlware');
const verifyKeyAndOrigin = require('../Middlewares/verifyProjectKeyAndOrigin')

// Route to send prompt to the AI model
router.post('/', verifyKeyAndOrigin, handlePrompt)
router.post('/image-gen', verifyKeyAndOrigin, generateImage)

module.exports = router;