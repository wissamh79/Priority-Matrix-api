const express = require("express");
const router = express.Router();
const { register, login, logout, verify } = require("../controllers/auth");
const refreshToken = require("../controllers/refreshToken");
router.post("/register", register);
router.post("/login", login);
router.get("/:id/verify/:verifyToken/", verify);

router.get("/logout", logout);
router.get("/refresh", refreshToken);

module.exports = router;
