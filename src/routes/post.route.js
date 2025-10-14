const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({storage: multer.memoryStorage()})
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createPostController
);

module.exports = router;
