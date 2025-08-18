const express = require("express");
const router = express.Router();

const { handlePrompt, generateImage, getAiUsage } = require("../controllers/ai-controller");

const jwtAuthMiddleware = require("../Middlewares/jwtAuthMiddlware");
const { body, header } = require("express-validator");
const {
  parseValidationResult,
} = require("../Middlewares/parse-validation-result");

const VerifyApiKey = require("../Middlewares/verify-api-key");

// Route to send prompt to the AI model
router.post(
  "/chat-completion",
  header("x-api-key")
    .notEmpty()
    .withMessage
    ("Api key is missing in request header"),
  VerifyApiKey,
  body("prompt")
  .notEmpty()
  .withMessage
  ("Please provide prompt"),
  parseValidationResult,
  handlePrompt
);


router.get("/ai-usage", jwtAuthMiddleware, getAiUsage)

router.post("/image-gen", generateImage);

module.exports = router;
