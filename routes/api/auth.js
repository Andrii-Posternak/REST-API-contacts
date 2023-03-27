const express = require("express");
const authController = require("../../controllers/authController");
const { auth } = require("../../middlewares");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", auth, authController.logout);

router.get("/current", auth, authController.getCurrentUser);

module.exports = router;
