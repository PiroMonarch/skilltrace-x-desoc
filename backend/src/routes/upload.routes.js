const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadResume } = require("../controllers/upload.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads", "resumes"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/resume", requireAuth, upload.single("resume"), uploadResume);

module.exports = router;
