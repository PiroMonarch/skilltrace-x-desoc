const express = require("express");
const router = express.Router();
const {
  getMe,
  updateStep1,
  updateStep2,
} = require("../controllers/onBoardingController");
const { requireAuth } = require("../middleware/auth"); // adjust to your actual auth middlewarecd

router.get("/me", requireAuth, getMe);
router.put("/step1", requireAuth, updateStep1);
router.put("/step2", requireAuth, updateStep2);

module.exports = router;
