const express = require("express");
const { loginRedirect, loginCallback } = require("./github.controller");

const router = express.Router();

router.get("/login", loginRedirect);
router.get("/callback", loginCallback);

module.exports = router;
