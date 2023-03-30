const express = require("express");
const usersController = require("../../controllers/usersController");
const { auth, upload } = require("../../middlewares");

const router = express.Router();

router.get("/current", auth, usersController.getCurrentUser);

router.patch("/", auth, usersController.updateSubscription);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  usersController.updateAvatar
);

router.get("/verify/:verificationToken", usersController.verification);

router.post("/verify", usersController.reVerification);

module.exports = router;
